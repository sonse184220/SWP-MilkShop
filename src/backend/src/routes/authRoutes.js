import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

import { AuthController } from '../controllers/AuthController.js';
import { checkRegister, checkLogin, isAdmin } from '../middlewares/validationMiddleware.js';

dotenv.config();

const router = express.Router();
const authController = new AuthController();

router.post('/register', checkRegister, authController.registerUser);
router.post('/login', checkLogin, authController.loginUser);
router.get('/verify-email', authController.verifyEmail);
router.post('/register-admin', checkRegister, authController.registerAdmin);
router.post('/create-staff', passport.authenticate('jwt', { session: false }), isAdmin, checkRegister, authController.createStaff);

export { router as authRoutes };
