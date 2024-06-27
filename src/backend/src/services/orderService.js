import { EmailService } from './EmailService.js';
import { connection, poolConnect } from '../utils/dbConnection.js';

export class OrderService {
    constructor() {
        this.emailService = new EmailService();
    }

    async getAllOrder(limit, sortBy, offset) {
        const [orders] = await poolConnect.query(`SELECT * FROM \`order\` ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [limit, offset])
        return orders;
    }

    async getTotalOrderNumber() {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM \`order\``);
        const count = total[0].count;
        return count;
    }

    placeOrder = (data, user, guestId, callback) => {
        const { PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address } = data;
        const UserID = user ? user.userId : null;
        const GuestID = guestId ? guestId : null;

        const getCartQuery = 'SELECT CART.ProductID, CART.CartQuantity, PRODUCT.Name as ProductName, PRODUCT.Price FROM CART JOIN PRODUCT ON CART.ProductID = PRODUCT.ProductID WHERE CART.UserID = ? OR CART.GuestID = ?';
        connection.query(getCartQuery, [UserID, GuestID], (err, cartItems) => {
            if (err) return callback(err);

            if (cartItems.length === 0) return callback(new Error('Cart is empty'));

            let initialTotalPrice = 0;
            cartItems.forEach(item => {
                initialTotalPrice += item.CartQuantity * item.Price;
            });

            if (VoucherIDs && VoucherIDs.length > 0) {
                const voucherQuery = 'SELECT * FROM VOUCHER WHERE VoucherID IN (?) AND Expiration > NOW() AND VoucherQuantity > 0';
                connection.query(voucherQuery, [VoucherIDs], (err, vouchers) => {
                    if (err) return callback(err);

                    let totalDiscount = 0;
                    vouchers.forEach(voucher => {
                        totalDiscount += parseFloat(voucher.Discount) / 100 * initialTotalPrice;
                        const updateVoucherQuantity = 'UPDATE VOUCHER SET VoucherQuantity = VoucherQuantity - 1 WHERE VoucherID = ?';
                        connection.query(updateVoucherQuantity, [voucher.VoucherID]);
                    });

                    const totalPrice = initialTotalPrice - totalDiscount;
                    this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, user, VoucherIDs, callback);
                });
            } else {
                const totalPrice = initialTotalPrice;
                this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, user, [], callback);
            }
        });
    };

    processOrder = (UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, user, VoucherIDs, callback) => {
        if (useRewardPoints && UserID) {
            const rewardQuery = 'SELECT RewardPoints FROM MEMBER WHERE UserID = ?';
            connection.query(rewardQuery, [UserID], (err, results) => {
                if (err) return callback(err);

                const availablePoints = results[0].RewardPoints;
                if (availablePoints > 0) {
                    const pointsToUse = Math.min(availablePoints, totalPrice);
                    const remainingPoints = availablePoints - pointsToUse;
                    totalPrice -= pointsToUse;

                    const updatePointsQuery = 'UPDATE MEMBER SET RewardPoints = ? WHERE UserID = ?';
                    connection.query(updatePointsQuery, [remainingPoints, UserID], (err, result) => {
                        if (err) return callback(err);

                        this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, pointsToUse, PaymentMethod, Name, Email, Phone, Address, user, VoucherIDs, callback);
                    });
                } else {
                    this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, 0, PaymentMethod, Name, Email, Phone, Address, user, VoucherIDs, callback);
                }
            });
        } else {
            this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, 0, PaymentMethod, Name, Email, Phone, Address, user, VoucherIDs, callback);
        }
    };

    finalizeOrder = (UserID, GuestID, cartItems, totalPrice, initialTotalPrice, usedPoints, PaymentMethod, Name, Email, Phone, Address, user, VoucherIDs, callback) => {
        const insertOrderQuery = 'INSERT INTO `ORDER` (UserID, GuestID, TotalPrice, PaymentMethod, Name, Email, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [UserID, GuestID, totalPrice, PaymentMethod, Name, Email, Phone, Address];

        connection.query(insertOrderQuery, values, (err, result) => {
            if (err) return callback(err);

            const orderId = result.insertId;
            const orderDetails = cartItems.map(item => [orderId, item.ProductID, item.CartQuantity, item.Price]);
            const insertOrderDetailsQuery = 'INSERT INTO ORDER_DETAILS (OrderID, ProductID, Quantity, Price) VALUES ?';

            connection.query(insertOrderDetailsQuery, [orderDetails], (err, result) => {
                if (err) return callback(err);

                const clearCartQuery = 'DELETE FROM CART WHERE UserID = ? OR GuestID = ?';
                connection.query(clearCartQuery, [UserID, GuestID], (err, result) => {
                    if (err) return callback(err);

                    const rewardPoints = Math.floor(totalPrice * 0.05);

                    if (UserID) {
                        const updateRewardPointsQuery = 'UPDATE MEMBER SET RewardPoints = RewardPoints + ? WHERE UserID = ?';
                        connection.query(updateRewardPointsQuery, [rewardPoints, UserID], (err, result) => {
                            if (err) return callback(err);
                            this.getVoucherDetails(VoucherIDs, (err, vouchers) => {
                                if (err) return callback(err);
                                this.emailService.sendOrderConfirmationEmail(Email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, { Name, Email, Phone, Address }, (err, result) => {
                                    if (err) return callback(err);
                                    callback(null, { message: 'Order placed successfully', orderId, rewardPoints, cartItems, totalPrice });
                                });
                            });
                        });
                    } else {
                        this.getVoucherDetails(VoucherIDs, (err, vouchers) => {
                            if (err) return callback(err);
                            this.emailService.sendOrderConfirmationEmail(Email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, { Name, Email, Phone, Address }, (err, result) => {
                                if (err) return callback(err);
                                callback(null, { message: 'Order placed successfully', orderId, cartItems, totalPrice });
                            });
                        });
                    }
                });
            });
        });
    };

    getVoucherDetails = (VoucherIDs, callback) => {
        if (VoucherIDs.length === 0) {
            return callback(null, []);
        }
        const query = 'SELECT VoucherID, Discount, Content FROM VOUCHER WHERE VoucherID IN (?)';
        connection.query(query, [VoucherIDs], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    };
}
