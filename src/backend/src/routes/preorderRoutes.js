import { Router } from "express";
import { checkAuthenticated } from "../middlewares/authMiddleware.js";
import { PreorderController } from "../controllers/PreorderController.js";
import { checkPreorderData, checkPreorderId, checkPreorderInputEta, checkPreorderInputStatus } from "../middlewares/preorderValidators.js";
import { checkPaginationQuery } from "../middlewares/utilsMiddleware.js";
import { isStaff } from "../middlewares/validationMiddleware.js";

const router = Router();
const preorderController = new PreorderController;

/** /api/preorder/history?limit={...}&page={...}&sort={...}
 * - trả lại dannh sách lịch sử pre-order trong database
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/preorder/staff/history", checkAuthenticated, isStaff, checkPaginationQuery, async (req, res) => {
    await preorderController.getPreorderHistory(req, res);
});

/** Đặt pre-order cho 1 sản phẩm
 * 
 */
router.post("/api/preorder/place-preorder", checkAuthenticated, checkPreorderData, async (req, res) => {
    await preorderController.placePreorder(req, res);
})

/** /api/preorder/{..id của pre-order..}/status
 * Cập nhật status của 1 đơn pre-order cho staff
 */
router.patch("/api/preorder/staff/:preorderId/status", checkAuthenticated, isStaff, checkPreorderId, checkPreorderInputStatus, async (req, res) => {
    await preorderController.updatePreorderStatus(req, res);
})

/**
 * cho user cancel status của 1 đơn pre-order
 */
router.patch("/api/preorder/:preorderId/preorder-cancel", checkAuthenticated, checkPreorderId, async (req, res) => {
    await preorderController.updatePreorderStatusCancel(req, res);
})

/** /api/preorder/{..id của pre-order..}/eta
 * Cập nhật ETA của 1 đơn pre-order cho staff
 */
router.patch("/api/preorder/staff/:preorderId/eta", checkAuthenticated, isStaff, checkPreorderId, checkPreorderInputEta, async (req, res) => {
    await preorderController.updatePreorderEta(req, res);
})

/**
 *  chuyển paymentstatus sang done cho COD/Banking, không có tác dụng cho các hình thức thanh toán khác
 */
router.patch("/api/preorder/staff/:preorderId/payment-done", checkAuthenticated, isStaff, checkPreorderId, async (req, res) => {
    await preorderController.updatePreorderPaymentStatusDone(req, res);
})


export { router as preorderRoutes }