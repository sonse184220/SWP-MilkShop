import express from 'express';
import passport from 'passport';

import { AdminController } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/validationMiddleware.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();
const adminController = new AdminController();

router.post('/disable-account', checkAuthenticated, isAdmin, adminController.disableAccount);
router.post('/enable-account', checkAuthenticated, isAdmin, adminController.enableAccount);
router.get('/total-revenue', checkAuthenticated, isAdmin, adminController.getTotalRevenue); //cái này lấy doanh thu của tháng hiện tại//
router.get('/accounts', checkAuthenticated, isAdmin, adminController.getAllAccounts);
router.get('/monthly-revenue', checkAuthenticated, isAdmin, adminController.getMonthlyRevenue); //cái này lấy doanh thu tất cả tháng trong năm//
router.get('/weekly-revenue', checkAuthenticated, isAdmin, adminController.getWeeklyRevenue);

export { router as adminRoutes };
