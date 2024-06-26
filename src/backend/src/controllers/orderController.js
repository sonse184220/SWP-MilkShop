import { OrderService } from '../services/orderService.js';

const orderService = new OrderService();

export class OrderController {
    placeOrder = (req, res) => {
        const guestId = req.session.guestId || null;
        orderService.placeOrder(req.body, req.user, guestId, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };
}
