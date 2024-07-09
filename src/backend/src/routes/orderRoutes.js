import express from 'express';
import { OrderController } from '../controllers/orderController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { checkOrderId, checkOrderInputStatus } from '../middlewares/orderValidators.js';
import { checkPaginationQuery } from '../middlewares/utilsMiddleware.js';
import { isStaff, isStaffOrAdmin } from '../middlewares/validationMiddleware.js';

const router = express.Router();
const orderController = new OrderController();

/** /api/order/history?limit={...}&page={...}&sort={...}
 * Lấy toàn bộ lịch sử mua hàng order trong database
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/staff/history", checkAuthenticated, isStaffOrAdmin, checkPaginationQuery, async (req, res) => {
    await orderController.getOrderHistory(req, res)
})

/** /api/order/{..id của order..}
 * Lấy thông tin chi tiết một order
 */
router.get("/:orderId", checkAuthenticated, checkOrderId, async (req, res) => {
    await orderController.getOrderById(req, res)
})

/** /api/order/{..id của order..}/status
 * Cập nhật status của 1 đơn order cho staff / admin
 */
router.patch("/staff/:orderId/status", checkAuthenticated, isStaff, checkOrderId, checkOrderInputStatus, async (req, res) => {
    await orderController.updateOrderStatus(req, res);
})

/**
 *  chuyển paymentstatus sang done cho COD/Banking, không có tác dụng cho các hình thức thanh toán khác
 */
router.patch("/staff/:orderId/payment-done", checkAuthenticated, isStaff, checkOrderId, async (req, res) => {
    await orderController.updateOrderPaymentStatusDone(req, res);
})

router.post('/place-order', checkAuthenticated, orderController.placeOrder);

export { router as orderRoutes };
