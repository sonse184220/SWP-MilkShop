import express from 'express';
import { OrderController } from '../controllers/orderController.js';
import { checkAuthenticated, getAuthRole } from '../middlewares/authMiddleware.js';
import { checkGetOrderHistoryQuery } from '../middlewares/orderValidators.js';

const router = express.Router();
const orderController = new OrderController();

/** /api/order/history?limit={...}&page={...}&sort={...}
 * Lấy toàn bộ lịch sử mua hàng order
 */
router.get("/history", checkAuthenticated, getAuthRole, checkGetOrderHistoryQuery, async (req, res) => {
    await orderController.getOrderHistory(req, res)
})

router.post('/place-order', checkAuthenticated, orderController.placeOrder);

export { router as orderRoutes };
