import { Router } from "express";
import { checkAuthenticated } from "../middlewares/authMiddleware.js";
import { PreorderController } from "../controllers/PreorderController.js";
import { checkPreorderData, checkPreorderId, checkPreorderInputEta, checkPreorderInputStatus } from "../middlewares/preorderValidators.js";
import { checkPaginationQuery } from "../middlewares/utilsMiddleware.js";
import { isStaff, isStaffOrAdmin } from "../middlewares/validationMiddleware.js";

const router = Router();
const preorderController = new PreorderController;

/** /api/preorder/history?limit={...}&page={...}&sort={...}
 * - trả lại dannh sách lịch sử pre-order trong database
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/preorder/history", checkAuthenticated, isStaffOrAdmin, checkPaginationQuery, async (req, res) => {
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
router.patch("/api/preorder/:preorderId/status", checkAuthenticated, isStaff, checkPreorderId, checkPreorderInputStatus, async (req, res) => {
    await preorderController.updatePreorderStatus(req, res);
})

/** /api/preorder/{..id của pre-order..}/eta
 * Cập nhật ETA của 1 đơn pre-order cho staff
 */
router.patch("/api/preorder/:preorderId/eta", checkAuthenticated, isStaff, checkPreorderId, checkPreorderInputEta, async (req, res) => {
    await preorderController.updatePreorderEta(req, res);
})


export { router as preorderRoutes }