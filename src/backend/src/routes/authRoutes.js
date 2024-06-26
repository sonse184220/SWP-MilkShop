import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

import { AuthController } from '../controllers/AuthController.js';
import { checkRegister, checkLogin } from '../middlewares/validationMiddleware.js';

dotenv.config();

const router = express.Router();
const authController = new AuthController();

router.post('/register', checkRegister, authController.registerUser);
router.post('/login', checkLogin, authController.loginUser);
router.get('/verify-email', authController.verifyEmail);

export { router as authRoutes };
