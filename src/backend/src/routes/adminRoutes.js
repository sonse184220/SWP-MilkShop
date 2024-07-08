import express from 'express';
import passport from 'passport';

import { AdminController } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/validationMiddleware.js';

const router = express.Router();
const adminController = new AdminController();

router.post('/disable-account', passport.authenticate('jwt', { session: false }), isAdmin, adminController.disableAccount);
router.post('/enable-account', passport.authenticate('jwt', { session: false }), isAdmin, adminController.enableAccount);
router.get('/total-revenue', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getTotalRevenue);
router.get('/accounts', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getAllAccounts);

export { router as adminRoutes };
