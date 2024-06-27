import { Router } from "express";
import { checkAuthenticated, getAuthRole } from "../middlewares/authMiddleware.js";
import { PreorderController } from "../controllers/PreorderController.js";
import { checkMemberId } from "../middlewares/userValidators.js";
import { checkPreorderData } from "../middlewares/preorderValidators.js";

const router = Router();
const preorderController = new PreorderController;

/** trả lại dannh sách lịch sử pre-order của một user
 * - {..id..} là id của user
 */
router.get("/api/preorder/:id/history", checkAuthenticated, getAuthRole, checkMemberId, async (req, res) => {
    // await preorderController.
});

/** Đặt pre-order cho 1 sản phẩm
 * 
 */
router.post("/api/preorder/place-preorder", checkAuthenticated, getAuthRole, checkPreorderData, async (req, res) => {
    await preorderController.placePreorder(req, res);
})



export { router as preorderRoutes }

