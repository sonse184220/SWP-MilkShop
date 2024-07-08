import express from 'express';
import { VoucherController } from '../controllers/voucherController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { isStaff } from '../middlewares/validationMiddleware.js';
import { checkVoucherData, checkVoucherId, checkVoucherUpdateData } from '../middlewares/voucherValidators.js';
import { checkPaginationQuery } from '../middlewares/utilsMiddleware.js';

const router = express.Router();
const voucherController = new VoucherController();

router.get('/available', checkAuthenticated, voucherController.getAvailableVouchers);
router.post('/use', checkAuthenticated, voucherController.useVoucher);

/**
 * Xem tất cả voucher kể cả đã hết hạn, dành cho staff
 */
router.get("/", checkAuthenticated, isStaff, checkPaginationQuery, async (req, res) => {
    await voucherController.getAllVoucher(req, res);
})

router.post("/create", checkAuthenticated, isStaff, checkVoucherData, async (req, res) => {
    await voucherController.createVoucher(req, res);
})

router.patch("/:voucherId/update", checkAuthenticated, isStaff, checkVoucherId, checkVoucherUpdateData, async (req, res) => {
    await voucherController.updateVoucher(req, res);
})

router.delete("/:voucherId/delete", checkAuthenticated, isStaff, checkVoucherId, async (req, res) => {
    await voucherController.deleteVoucher(req, res);
})

export { router as voucherRoutes };
