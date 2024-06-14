import express from 'express';
import { passport } from '../controllers/authController.js';
import * as authService from '../services/authService.js';
import { checkRegister, checkLogin } from '../middlewares/validationMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/register', checkRegister, authService.registerUser);
router.post('/login', checkLogin, authService.loginUser);
router.get('/verify-email', authService.verifyEmail);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Redirect to a page to complete profile after successful login
    res.redirect(`/complete-profile?userId=${req.user.UserID}`);
});

export default router;
