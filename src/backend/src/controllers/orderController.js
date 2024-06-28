import { OrderService } from '../services/orderService.js';

const orderService = new OrderService();

export class OrderController {
    async getOrderById(req, res) {
        const orderId = req.params.id;

        const order = await orderService.getOrder(orderId);
        if (order.length === 0) {
            return res.status(404).send({ error: "Order not found!" });
        }

        if (req.user.userId !== order[0].UserID && req.userRole !== "admin" && req.userRole !== "staff") {
            return res.status(401).send({ msg: "Unauthorized!" });
        }

        const orderDetail = await orderService.getOrderDetail(orderId);

        return res.status(200).send({
            order: order[0],
            detail: orderDetail,
        });
    }

    async getOrderHistory(req, res) {
        if (req.userRole !== "admin" && req.userRole !== "staff") {
            return res.status(401).send({ msg: "Unauthorized! Only staff or admin can view all order history" });
        }

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
    }

    async getUserOrderHistory(req, res) {
        if (req.user.userId !== req.params.id && req.userRole !== "admin" && req.userRole !== "staff") {
            return res.status(401).send({ msg: "Unauthorized" });
        }

        const userId = req.params.id;
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
    }

    placeOrder = (req, res) => {
        const guestId = req.session.guestId || null;
        orderService.placeOrder(req.body, req.user, guestId, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    }
}
