import express from 'express';
import { requestResetPassword, resetPassword } from '../controllers/resetPasswordController.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/request-reset-password', requestResetPassword);
router.post('/reset-password', resetPassword);

export default router;
