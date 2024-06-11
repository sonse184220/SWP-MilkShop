const express = require('express');
const passport = require('../controllers/authController').passport;
const authService = require('../services/authService');
const { checkRegister, checkLogin } = require('../middlewares/validationMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/register', checkRegister, authService.registerUser);
router.post('/login', checkLogin, authService.loginUser);
router.get('/verify-email', authService.verifyEmail);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Redirect to a page to complete profile after successful login
    res.redirect(`/complete-profile?userId=${req.user.UserID}`);
});

module.exports = router;
