import express from 'express';
import { passport } from '../services/authService.js';
import * as authController from '../controllers/authController.js';
import { checkRegister, checkLogin } from '../middlewares/validationMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/register', checkRegister, authController.registerUser);
router.post('/login', checkLogin, authController.loginUser);
router.get('/verify-email', authController.verifyEmail);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`/complete-profile?userId=${req.user.UserID}`);
});

export default router;
