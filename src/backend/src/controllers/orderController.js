import { OrderService } from '../services/orderService.js';
import { UserService } from '../services/userService.js';

const orderService = new OrderService();
const userService = new UserService();

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
            } else if (order[0].Status === status) {
                return res.status(200).send(order);
            }

            const updatingOrder = await orderService.updateOrderStatus(orderId, status);
            if (updatingOrder.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update order status!" });
            }

            if (status === "Cancelled") {
                const rewardpointsDeduct = -Math.floor(order[0].TotalPrice * 0.02);
                const updateRewardpoints = await userService.updateUserRewardPoints(order[0].UserID, rewardpointsDeduct);
                if (updateRewardpoints.affectedRows === 0) {
                    return res.status(500).send({ error: "Failed to update user RewardPoints!" });
                }
            } else if (status !== "Cancelled" && order[0].Status === "Cancelled") {
                const rewardpointsGain = Math.floor(order[0].TotalPrice * 0.02);
                const updateRewardpoints = await userService.updateUserRewardPoints(order[0].UserID, rewardpointsGain);
                if (updateRewardpoints.affectedRows === 0) {
                    return res.status(500).send({ error: "Failed to update user RewardPoints!" });
                }
            }

            if ((status === "Shipping" || status === "Done") && order[0].PaymentStatus !== "Done" && order[0].PaymentMethod !== "COD") {
                return res.status(403).send({ msg: "This order hasnt been paid yet." })
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

            const rewardpointsDeduct = -Math.floor(order[0].TotalPrice * 0.02);
            const updateRewardpoints = await userService.updateUserRewardPoints(order[0].UserID, rewardpointsDeduct);
            if (updateRewardpoints.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to update user RewardPoints!" });
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
