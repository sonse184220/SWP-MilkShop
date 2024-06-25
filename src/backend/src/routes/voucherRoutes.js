import express from 'express';
import { VoucherController } from '../controllers/voucherController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();
const voucherController = new VoucherController();

router.get('/available', checkAuthenticated, voucherController.getAvailableVouchers);
router.post('/use', checkAuthenticated, voucherController.useVoucher);

export { router as voucherRoutes };
