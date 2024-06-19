import express from 'express';
import { resetPasswordController } from '../controllers/resetPasswordController.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/request-reset-password', resetPasswordController.requestResetPassword);
router.post('/', resetPasswordController.resetPassword);

export { router as resetPasswordRoutes };
