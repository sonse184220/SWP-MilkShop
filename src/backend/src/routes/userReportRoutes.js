import express from 'express';
import { UserReportController } from '../controllers/userReportController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { isStaff } from '../middlewares/validationMiddleware.js';
import { checkPaginationQueryForUserReport, checkReportId, checkUserReportSubmitData, checkUserReportUpdateData } from '../middlewares/userReportValidation.js';
import { check } from 'express-validator';
import { checkUserId } from '../middlewares/userValidators.js';

const router = express.Router();
const userReportController = new UserReportController();

/** /api/user-reports/staff?sort={...}&limit={...}&page={...}&status={...}
 * Staff lấy toàn bộ danh sách report hiện tại trong database
 * Sort có thể lf ["newest", "oldest", "recent", "past"]
 */
router.get("/api/user-reports/staff/view", checkAuthenticated, isStaff, checkPaginationQueryForUserReport, async (req, res) => {
    await userReportController.getAllUserReports(req, res);
})

/**
 * Lấy toàn bộ danh sách report của 1 user
 */
router.get("/api/user-reports/:userId/history", checkAuthenticated, checkUserId, checkPaginationQueryForUserReport, async (req, res) => {
    await userReportController.getUserReports(req, res);
})

/**
 * Lấy chi tiết 1 report
 */
router.get("/api/user-reports/:reportId", checkAuthenticated, checkReportId, async (req, res) => {
    await userReportController.getReport(req, res);
})

/**
 * Gửi report
 */
router.post("/api/user-reports/submit", checkAuthenticated, checkUserReportSubmitData, async (req, res) => {
    await userReportController.createReport(req, res);
})

/**
 * Staff update report 
 */
router.patch("/api/user-reports/staff/:reportId", checkAuthenticated, isStaff, checkReportId, checkUserReportUpdateData, async (req, res) => {
    await userReportController.updateReport(req, res);
})

router.delete("/api/user-reports/staff/:reportId", checkAuthenticated, checkReportId, async (req, res) => {
    await userReportController.deleteReport(req, res);
})



export { router as userReportRoutes };