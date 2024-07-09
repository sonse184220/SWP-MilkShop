import { OrderService } from '../services/orderService.js';

const orderService = new OrderService();

export class OrderController {
    async getOrderById(req, res) {
        try {
            const orderId = req.params.orderId;

            const order = await orderService.getOrder(orderId);
            if (order.length === 0) {
                return res.status(404).send({ error: "Order not found!" });
            }

            if (req.user.userId !== order[0].UserID && !req.user.isAdmin && !req.user.isStaff) {
                return res.status(403).send({ msg: "Forbidden." });
            }

            const orderDetail = await orderService.getOrderDetail(orderId);

            return res.status(200).send({
                order: order[0],
                detail: orderDetail,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getOrderHistory(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const sort = req.query.sort;
            const offset = (page - 1) * limit;

            let sortBy;
            switch (sort) {
                case "newest":
                    sortBy = "updated DESC";
                    break;
                case "oldest":
                    sortBy = "updated ASC";
                    break;
                case "lowest":
                    sortBy = "TotalPrice ASC";
                    break;
                case "highest":
                    sortBy = "TotalPrice DESC";
                    break;
                default:
                    sortBy = "updated DESC";
            }

            const orders = await orderService.getAllOrderHistory(limit, sortBy, offset);
            const total = await orderService.getTotalOrderNumber();

            return res.status(200).send({
                total: total,
                page: page,
                totalPages: Math.ceil(total / limit),
                data: orders,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserOrderHistory(req, res) {
        try {
            if (req.user.userId !== req.params.userId && !req.user.isAdmin && !req.user.isStaff) {
                return res.status(403).send({ msg: "Forbidden." });
            }

            const userId = req.params.userId;
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const sort = req.query.sort;
            const offset = (page - 1) * limit;

            let sortBy;
            switch (sort) {
                case "newest":
                    sortBy = "updated DESC";
                    break;
                case "oldest":
                    sortBy = "updated ASC";
                    break;
                case "lowest":
                    sortBy = "TotalPrice ASC";
                    break;
                case "highest":
                    sortBy = "TotalPrice DESC";
                    break;
                default:
                    sortBy = "updated DESC";
            }

            const orders = await orderService.getUserOrderHistory(userId, limit, sortBy, offset);
            const total = await orderService.getTotalUserOrderNumber(userId);

            return res.status(200).send({
                total: total,
                page: page,
                totalPages: Math.ceil(total / limit),
                data: orders,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async placeOrder(req, res) {
        try {
            const guestId = req.session.guestId || null;
            const result = await orderService.placeOrder(req.body, req.user, guestId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const orderId = req.params.orderId;
            const status = req.body.status;

            const order = await orderService.getOrder(orderId);
            if (order.length === 0) {
                return res.status(404).send({ error: "Order not found!" });
            }

            const updatingOrder = await orderService.updateOrderStatus(orderId, status);
            if (updatingOrder.affectedRows === 0 && order[0].Status === status) {
                return res.status(200).send(order);
            } else if (updatingOrder.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update order status!" });
            }

            const updatedOrder = await orderService.getOrder(orderId);
            return res.status(200).send(updatedOrder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateOrderStatusCancel(req, res) {
        try {
            const orderId = req.params.orderId;

            const order = await orderService.getOrder(orderId);
            if (order.length === 0) {
                return res.status(404).send({ error: "Order not found!" });
            }
            if (order[0].UserID !== req.user.userId) {
                return res.status(403).send({ msg: "Forbidden." });
            }
            if (order[0].Status !== 'Waiting') {
                return res.status(409).send({ msg: "You cant no longer cancel this order!" });
            }

            const updatingOrder = await orderService.updateOrderStatusCancel(orderId);
            if (updatingOrder.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to update order status!" });
            }

            const updatedOrder = await orderService.getOrder(orderId);
            return res.status(200).send(updatedOrder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateOrderPaymentStatusDone(req, res) {
        try {
            const orderId = req.params.orderId;

            const order = await orderService.getOrder(orderId);
            if (order.length === 0) {
                return res.status(404).send({ error: "Order not found!" });
            }
            if (order[0].PaymentMethod !== 'COD' && order[0].PaymentMethod !== 'Banking') {
                return res.status(409).send({ msg: "You can only use this to update payment status for COD/Banking order." });
            }

            const updatingOrder = await orderService.updatePaymentStatusDone(orderId);
            if (updatingOrder.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to update order payment status!" });
            }

            const updatedOrder = await orderService.getOrder(orderId);
            return res.status(200).send(updatedOrder);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
