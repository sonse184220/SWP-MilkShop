import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

import { AuthController } from '../controllers/AuthController.js';
import { checkRegister, checkLogin } from '../middlewares/validationMiddleware.js';
import "../strategies/googleStrategy.js";

dotenv.config();

const router = express.Router();
const authController = new AuthController();

router.post('/register', checkRegister, authController.registerUser);
router.post('/login', checkLogin, authController.loginUser);
router.get('/verify-email', authController.verifyEmail);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`/complete-profile?userId=${req.user.UserID}`);
});

export { router as authRoutes };
