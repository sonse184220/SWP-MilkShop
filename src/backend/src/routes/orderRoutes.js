import express from 'express';
import { OrderController } from '../controllers/orderController.js';
import { checkAuthenticated, getAuthRole } from '../middlewares/authMiddleware.js';
import { checkOrderId, checkOrderInputStatus } from '../middlewares/orderValidators.js';
import { checkPaginationQuery } from '../middlewares/utilsMiddleware.js';

const router = express.Router();
const orderController = new OrderController();

/** /api/order/history?limit={...}&page={...}&sort={...}
 * Lấy toàn bộ lịch sử mua hàng order trong database
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/history", checkAuthenticated, getAuthRole, checkPaginationQuery, async (req, res) => {
    await orderController.getOrderHistory(req, res)
})

/** /api/order/{..id của order..}
 * Lấy thông tin chi tiết một order
 */
router.get("/:id", checkAuthenticated, getAuthRole, checkOrderId, async (req, res) => {
    await orderController.getOrderById(req, res)
})

/** /api/order/{..id của order..}/status
 * Cập nhật status của 1 đơn order
 */
router.patch("/:id/status", checkAuthenticated, getAuthRole, checkOrderId, checkOrderInputStatus, async (req, res) => {
    await orderController.updateOrderStatus(req, res);
})

router.post('/place-order', checkAuthenticated, orderController.placeOrder);

export { router as orderRoutes };
