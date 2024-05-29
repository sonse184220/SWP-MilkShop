const express = require('express');
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
const { checkRegister, checkLogin } = require('../middlewares/validationMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/register', checkRegister, registerUser);
router.post('/login', checkLogin, loginUser);
router.get('/verify-email', verifyEmail);

module.exports = router;
