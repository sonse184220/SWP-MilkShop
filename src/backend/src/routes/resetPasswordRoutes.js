import express from 'express';
import { resetPasswordController } from '../controllers/resetPasswordController.js';
import { checkResetPasswordRequest, checkResetPassword } from '../middlewares/validationMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/request-reset-password', checkResetPasswordRequest, resetPasswordController.requestResetPassword);
router.get('/', checkResetPassword, resetPasswordController.verifyResetToken);

export { router as resetPasswordRoutes };
