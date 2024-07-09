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

    async updatePaymentStatusDone(orderId) {
        const [order] = await poolConnect.query("UPDATE `order` SET PaymentStatus = 'Done' WHERE OrderID = ?", [orderId]);
        return order;
    }

    async placeOrder(data, user, guestId) {
        const { PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address, cart } = data;
        const UserID = user && user.userId !== 'guest' ? user.userId : null;
        const GuestID = user && user.userId === 'guest' ? guestId : null;

        if (UserID) {
            const getCartQuery = 'SELECT CART.ProductID, CART.CartQuantity, PRODUCT.Name as ProductName, PRODUCT.Price, PRODUCT.Quantity as AvailableQuantity FROM CART JOIN PRODUCT ON CART.ProductID = PRODUCT.ProductID WHERE CART.UserID = ?';
            const [cartItems] = await poolConnect.query(getCartQuery, [UserID]);

            if (cartItems.length === 0) throw new Error('Cart is empty');

            const outOfStockItems = cartItems.filter(item => item.CartQuantity > item.AvailableQuantity);
            if (outOfStockItems.length > 0) {
                const outOfStockMessages = outOfStockItems.map(item => `Product ${item.ProductName} does not have enough stock. Available quantity: ${item.AvailableQuantity}, Requested quantity: ${item.CartQuantity}`);
                throw new Error(outOfStockMessages.join('; '));
            }

            return this.calculateTotalPriceAndProcessOrder(cartItems, UserID, null, PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address);
        } else {
            const productIds = cart.map(item => item.ProductID);
            const getProductQuery = 'SELECT ProductID, Name, Price, Quantity FROM PRODUCT WHERE ProductID IN (?)';
            const [products] = await poolConnect.query(getProductQuery, [productIds]);

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
                throw new Error(outOfStockMessages.join('; '));
            }

            return this.calculateTotalPriceAndProcessOrder(validatedCartItems, null, GuestID, PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address);
        }
    }

    async calculateTotalPriceAndProcessOrder(cartItems, UserID, GuestID, PaymentMethod, VoucherIDs, useRewardPoints, Name, Email, Phone, Address) {
        let initialTotalPrice = 0;
        cartItems.forEach(item => {
            initialTotalPrice += item.CartQuantity * item.Price;
        });

        if (VoucherIDs && VoucherIDs.length > 0) {
            const voucherQuery = 'SELECT * FROM VOUCHER WHERE VoucherID IN (?) AND Expiration > NOW() AND VoucherQuantity > 0';
            const [vouchers] = await poolConnect.query(voucherQuery, [VoucherIDs]);

            let totalDiscount = 0;
            for (const voucher of vouchers) {
                totalDiscount += parseFloat(voucher.Discount) / 100 * initialTotalPrice;
                const updateVoucherQuantity = 'UPDATE VOUCHER SET VoucherQuantity = VoucherQuantity - 1 WHERE VoucherID = ?';
                await poolConnect.query(updateVoucherQuantity, [voucher.VoucherID]);
            }

            const totalPrice = initialTotalPrice - totalDiscount;
            return this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, VoucherIDs);
        } else {
            const totalPrice = initialTotalPrice;
            return this.processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, []);
        }
    }

    async processOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, PaymentMethod, Name, Email, Phone, Address, useRewardPoints, VoucherIDs) {
        if (useRewardPoints && UserID) {
            const rewardQuery = 'SELECT RewardPoints FROM User WHERE UserID = ?';
            const [results] = await poolConnect.query(rewardQuery, [UserID]);

            const availablePoints = results[0].RewardPoints;
            if (availablePoints > 0) {
                const pointsToUse = Math.min(availablePoints, totalPrice);
                const remainingPoints = availablePoints - pointsToUse;
                totalPrice -= pointsToUse;

                const updatePointsQuery = 'UPDATE User SET RewardPoints = ? WHERE UserID = ?';
                await poolConnect.query(updatePointsQuery, [remainingPoints, UserID]);

                return this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, pointsToUse, PaymentMethod, Name, Email, Phone, Address, VoucherIDs);
            } else {
                return this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, 0, PaymentMethod, Name, Email, Phone, Address, VoucherIDs);
            }
        } else {
            return this.finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, 0, PaymentMethod, Name, Email, Phone, Address, VoucherIDs);
        }
    }

    async finalizeOrder(UserID, GuestID, cartItems, totalPrice, initialTotalPrice, usedPoints, PaymentMethod, Name, Email, Phone, Address, VoucherIDs) {
        const insertOrderQuery = 'INSERT INTO `ORDER` (UserID, GuestID, TotalPrice, PaymentMethod, Name, Email, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [UserID, GuestID, totalPrice, PaymentMethod, Name, Email, Phone, Address];
        const [result] = await poolConnect.query(insertOrderQuery, values);

        const orderId = result.insertId;
        const orderDetails = cartItems.map(item => [orderId, item.ProductID, item.CartQuantity, item.Price]);
        const insertOrderDetailsQuery = 'INSERT INTO ORDER_DETAILS (OrderID, ProductID, Quantity, Price) VALUES ?';
        await poolConnect.query(insertOrderDetailsQuery, [orderDetails]);

        const clearCartQuery = 'DELETE FROM CART WHERE UserID = ? OR GuestID = ?';
        await poolConnect.query(clearCartQuery, [UserID, GuestID]);

        const rewardPoints = Math.floor(totalPrice * 0.02);

        for (const item of cartItems) {
            const updateProductQuantityQuery = 'UPDATE PRODUCT SET Quantity = Quantity - ? WHERE ProductID = ?';
            await poolConnect.query(updateProductQuantityQuery, [item.CartQuantity, item.ProductID]);
        }

        if (UserID) {
            const updateRewardPointsQuery = 'UPDATE User SET RewardPoints = RewardPoints + ? WHERE UserID = ?';
            await poolConnect.query(updateRewardPointsQuery, [rewardPoints, UserID]);
            const vouchers = await this.getVoucherDetails(VoucherIDs);
            await this.emailService.sendOrderConfirmationEmail(Email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, { Name, Email, Phone, Address });
            return { message: 'Order placed successfully', orderId, rewardPoints, cartItems, totalPrice };
        } else {
            const vouchers = await this.getVoucherDetails(VoucherIDs);
            await this.emailService.sendOrderConfirmationEmail(Email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, { Name, Email, Phone, Address });
            return { message: 'Order placed successfully', orderId, cartItems, totalPrice };
        }
    }

    async getVoucherDetails(VoucherIDs) {
        if (VoucherIDs.length === 0) {
            return [];
        }
        const query = 'SELECT VoucherID, Discount, Content FROM VOUCHER WHERE VoucherID IN (?)';
        const [results] = await poolConnect.query(query, [VoucherIDs]);
        return results;
    }
}
