import { Router } from "express";
import { checkAuthenticated, getAuthRole } from "../middlewares/authMiddleware.js";
import { PreorderController } from "../controllers/PreorderController.js";
import { checkPreorderData } from "../middlewares/preorderValidators.js";
import { checkPaginationQuery } from "../middlewares/utilsMiddleware.js";
import { checkOrderId, checkOrderInputStatus } from "../middlewares/orderValidators.js";

const router = Router();
const preorderController = new PreorderController;

/** /api/preorder/history?limit={...}&page={...}&sort={...}
 * - trả lại dannh sách lịch sử pre-order trong database
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/preorder/history", checkAuthenticated, getAuthRole, checkPaginationQuery, async (req, res) => {
    await preorderController.getPreorderHistory(req, res);
});

/** Đặt pre-order cho 1 sản phẩm
 * 
 */
router.post("/api/preorder/place-preorder", checkAuthenticated, getAuthRole, checkPreorderData, async (req, res) => {
    await preorderController.placePreorder(req, res);
})

/** /api/preorder/{..id của pre-order..}/status
 * Cập nhật status của 1 đơn pre-order
 */
router.patch("/api/preorder/:id/status", checkAuthenticated, getAuthRole, checkOrderId, checkOrderInputStatus, async (req, res) => {
    await preorderController.updatePreorderStatus(req, res);
})



export { router as preorderRoutes }

