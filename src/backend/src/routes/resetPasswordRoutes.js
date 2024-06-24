import express from 'express';
import { resetPasswordController } from '../controllers/resetPasswordController.js';

const router = express.Router();

router.post('/request-reset-password', resetPasswordController.requestResetPassword);
router.get('/', resetPasswordController.verifyResetToken);

export { router as resetPasswordRoutes };
