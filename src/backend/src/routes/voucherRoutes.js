import express from 'express';
import { VoucherController } from '../controllers/voucherController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { isStaff } from '../middlewares/validationMiddleware.js';
import { checkVoucherData } from '../middlewares/voucherValidators.js';

const router = express.Router();
const voucherController = new VoucherController();

router.get('/available', checkAuthenticated, voucherController.getAvailableVouchers);
router.post('/use', checkAuthenticated, voucherController.useVoucher);

router.post("/create", checkAuthenticated, isStaff, checkVoucherData, async (req, res) => {
    await voucherController.createVoucher(req, res);
})

export { router as voucherRoutes };
