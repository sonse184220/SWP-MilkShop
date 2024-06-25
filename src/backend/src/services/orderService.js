import { EmailService } from './emailService.js';
import { connection } from '../utils/dbConnection.js';

export class OrderService {
    constructor() {
        this.emailService = new EmailService();
    }

    placeOrder = (data, user, guestId, callback) => {
        const { PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address } = data;
        const UserID = user ? user.userId : null;
        const GuestID = guestId ? guestId : null;

        const getCartQuery = 'SELECT CART.ProductID, CART.CartQuantity, PRODUCT.Price, PRODUCT.Name AS ProductName FROM CART JOIN PRODUCT ON CART.ProductID = PRODUCT.ProductID WHERE CART.UserID = ? OR CART.GuestID = ?';
        connection.query(getCartQuery, [UserID, GuestID], (err, cartItems) => {
            if (err) return callback(err);

            if (cartItems.length === 0) return callback(new Error('Cart is empty'));

            let initialTotalPrice = 0;
            cartItems.forEach(item => {
                initialTotalPrice += item.CartQuantity * item.Price;
            });

            if (VoucherIDs && VoucherIDs.length > 0) {
                const voucherQuery = 'SELECT VoucherID, Discount FROM VOUCHER WHERE VoucherID IN (?)';
                connection.query(voucherQuery, [VoucherIDs], (err, voucherResults) => {
                    if (err) return callback(err);

                    let totalPrice = initialTotalPrice;
                    voucherResults.forEach(voucher => {
                        const discount = parseFloat(voucher.Discount) / 100;
                        totalPrice -= totalPrice * discount;
                    });

                    this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, user, voucherResults, callback);
                });
            } else {
                this.processOrder(UserID, GuestID, cartItems, initialTotalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, user, [], callback);
            }
        });
    };

    processOrder = (UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, user, vouchers, callback) => {
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

                        this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, pointsToUse, PaymentMethod, Name, Email, Phone, Address, user, vouchers, initialTotalPrice, callback);
                    });
                } else {
                    this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, 0, PaymentMethod, Name, Email, Phone, Address, user, vouchers, initialTotalPrice, callback);
                }
            });
        } else {
            this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, 0, PaymentMethod, Name, Email, Phone, Address, user, vouchers, initialTotalPrice, callback);
        }
    };

    finalizeOrder = (UserID, GuestID, cartItems, totalPrice, usedPoints, PaymentMethod, Name, Email, Phone, Address, user, vouchers, initialTotalPrice, callback) => {
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
                            this.emailService.sendOrderConfirmationEmail(Email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, { Name, Email, Phone, Address }, (err, result) => {
                                if (err) return callback(err);
                                callback(null, { message: 'Order placed successfully', orderId, rewardPoints, cartItems, totalPrice });
                            });
                        });
                    } else {
                        this.emailService.sendOrderConfirmationEmail(Email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, { Name, Email, Phone, Address }, (err, result) => {
                            if (err) return callback(err);
                            callback(null, { message: 'Order placed successfully', orderId, cartItems, totalPrice });
                        });
                    }
                });
            });
        });
    };
}
