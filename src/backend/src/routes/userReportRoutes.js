import express from 'express';
import { UserReportController } from '../controllers/userReportController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { isStaff } from '../middlewares/validationMiddleware.js';
import { checkPaginationQueryForUserReport, checkUserReportSubmitData } from '../middlewares/userReportValidation.js';

const router = express.Router();
const userReportController = new UserReportController();

/** /api/user-reports/staff?sort={...}&limit={...}&page={...}&status={...}
 * Staff lấy toàn bộ danh sách report hiện tại trong database
 * Sort có thể lf ["newest", "oldest", "recent", "past"]
 */
router.get("/api/user-reports/staff", checkAuthenticated, isStaff, checkPaginationQueryForUserReport, async (req, res) => {
    await userReportController.getAllUserReports(req, res);
})

/**
 * Lấy toàn bộ danh sách report của 1 user
 */
router.get("/api/user-reports/:userId")

/**
 * Lấy chi tiết 1 report
 */
router.get("/api/user-reports/:reportId")

/**
 * Gửi report
 */
router.post("/api/user-reports/submit", checkAuthenticated, checkUserReportSubmitData, async (req, res) => {
    await userReportController.createReport(req, res);
})

/**
 * Update report 
 */
router.patch("/api/user-reports/staff/:reportId")



export { router as userReportRoutes };