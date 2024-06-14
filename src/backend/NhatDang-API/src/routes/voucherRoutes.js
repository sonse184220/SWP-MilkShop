import express from 'express';
import * as voucherService from '../services/voucherService.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', checkAuthenticated, voucherService.getAllVouchers);

export default router;
