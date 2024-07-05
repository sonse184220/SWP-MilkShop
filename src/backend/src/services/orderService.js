import { EmailService } from './EmailService.js';
import { connection, poolConnect } from '../utils/dbConnection.js';

export class OrderService {
    constructor() {
        this.emailService = new EmailService();
    }

    async getAllOrderHistory(limit, sortBy, offset) {
        const [orders] = await poolConnect.query(`SELECT * FROM \`order\` ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [limit, offset]);
        return orders;
    }

    async getUserOrderHistory(userId, limit, sortBy, offset) {
        const [orders] = await poolConnect.query(`SELECT * FROM \`order\` WHERE UserID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [userId, limit, offset]);
        return orders;
    }

    async getOrder(id) {
        const [order] = await poolConnect.query(`SELECT * FROM \`order\` WHERE OrderID = ?`, [id]);
        return order;
    }

    async getOrderDetail(id) {
        const [orderDetail] = await poolConnect.query(`SELECT od.*, p.Name, p.Price, p.brandId, b.Name as brandName
                                                    FROM order_details AS od
                                                    JOIN product AS p ON od.ProductID = p.ProductID
                                                    JOIN brand AS b ON b.BrandID = p.BrandID
                                                    WHERE OrderID = ?`, [id]);
        return orderDetail;
    }

    async getTotalOrderNumber() {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM \`order\``);
        const count = total[0].count;
        return count;
    }

    async getTotalUserOrderNumber(userId) {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM \`order\` WHERE UserID =?`, [userId]);
        const count = total[0].count;
        return count;
    }

    async updateOrderStatus(orderId, status) {
        const [order] = await poolConnect.query("UPDATE `order` SET Status = ? WHERE OrderID = ?", [status, orderId]);
        return order;
    }
    async updateOrderStatusCancel(orderId) {
        const [order] = await poolConnect.query("UPDATE `order` SET Status = 'Cancelled' WHERE OrderID = ?", [orderId]);
        return order;
    }

    placeOrder = (data, user, guestId, callback) => {
        const { PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address, cart } = data;
        const UserID = user && user.userId !== 'guest' ? user.userId : null;
        const GuestID = user && user.userId === 'guest' ? guestId : null;

        if (UserID) {
            const getCartQuery = 'SELECT CART.ProductID, CART.CartQuantity, PRODUCT.Name as ProductName, PRODUCT.Price, PRODUCT.Quantity as AvailableQuantity FROM CART JOIN PRODUCT ON CART.ProductID = PRODUCT.ProductID WHERE CART.UserID = ?';
            connection.query(getCartQuery, [UserID], (err, cartItems) => {
                if (err) return callback(err);

                if (cartItems.length === 0) return callback(new Error('Cart is empty'));

                const outOfStockItems = cartItems.filter(item => item.CartQuantity > item.AvailableQuantity);
                if (outOfStockItems.length > 0) {
                    const outOfStockMessages = outOfStockItems.map(item => `Product ${item.ProductName} does not have enough stock. Available quantity: ${item.AvailableQuantity}, Requested quantity: ${item.CartQuantity}`);
                    return callback(new Error(outOfStockMessages.join('; ')));
                }

                this.calculateTotalPriceAndProcessOrder(cartItems, UserID, null, PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address, callback);
            });
        } else {
            const productIds = cart.map(item => item.ProductID);
            const getProductQuery = 'SELECT ProductID, Name, Price, Quantity FROM PRODUCT WHERE ProductID IN (?)';

            connection.query(getProductQuery, [productIds], (err, products) => {
                if (err) return callback(err);

                const outOfStockMessages = [];
                const validatedCartItems = cart.map(cartItem => {
                    const product = products.find(p => p.ProductID === cartItem.ProductID);
                    if (!product) {
                        outOfStockMessages.push(`Product ID ${cartItem.ProductID} not found`);
                    } else if (cartItem.Quantity > product.Quantity) {
                        outOfStockMessages.push(`Product ${product.Name} does not have enough stock. Available quantity: ${product.Quantity}, Requested quantity: ${cartItem.Quantity}`);
                    }
                    return {
                        ProductID: cartItem.ProductID,
                        CartQuantity: cartItem.Quantity,
                        ProductName: product ? product.Name : '',
                        Price: product ? product.Price : 0,
                        AvailableQuantity: product ? product.Quantity : 0
                    };
                });

                if (outOfStockMessages.length > 0) {
                    return callback(new Error(outOfStockMessages.join('; ')));
                }

                this.calculateTotalPriceAndProcessOrder(validatedCartItems, null, GuestID, PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address, callback);
            });
        }
    };

    calculateTotalPriceAndProcessOrder = (cartItems, UserID, GuestID, PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address, callback) => {
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
                this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, VoucherIDs, callback);
            });
        } else {
            const totalPrice = initialTotalPrice;
            this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, [], callback);
        }
    };

    processOrder = (UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, VoucherIDs, callback) => {
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

                        this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, pointsToUse, PaymentMethod, Name, Email, Phone, Address, VoucherIDs, callback);
                    });
                } else {
                    this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, 0, PaymentMethod, Name, Email, Phone, Address, VoucherIDs, callback);
                }
            });
        } else {
            this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, 0, PaymentMethod, Name, Email, Phone, Address, VoucherIDs, callback);
        }
    };

    finalizeOrder = (UserID, GuestID, cartItems, totalPrice, initialTotalPrice, usedPoints, PaymentMethod, Name, Email, Phone, Address, VoucherIDs, callback) => {
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

                    const rewardPoints = Math.floor(totalPrice * 0.02);

                    const updateProductQuantityPromises = cartItems.map(item => {
                        return new Promise((resolve, reject) => {
                            const updateProductQuantityQuery = 'UPDATE PRODUCT SET Quantity = Quantity - ? WHERE ProductID = ?';
                            connection.query(updateProductQuantityQuery, [item.CartQuantity, item.ProductID], (err, result) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    });

                    Promise.all(updateProductQuantityPromises)
                        .then(() => {
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
                        })
                        .catch(err => callback(err));
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
