import { Router } from "express";
import { checkAuthenticated, getAuthRole } from "../middlewares/authMiddleware.js";
import { PreorderController } from "../controllers/PreorderController.js";
import { checkMemberId } from "../middlewares/userValidators.js";

const router = Router();
const preorderController = new PreorderController;

/** trả lại dannh sách lịch sử pre-order của một user
 * - {..id..} là id của user
 */
router.get("/api/preorder/:id/history", checkAuthenticated, getAuthRole, checkMemberId, async (req, res) => {
    // await preorderController.
});



export { router as preorderRoutes }

