import { AuthController } from '../controllers/AuthController.js';

const express = require('express');
const { checkRegister, checkLogin } = require('../middlewares/validationMiddleware');
require('dotenv').config();

const router = express.Router();
const authController = new AuthController();

router.post('/register', checkRegister, authController.registerUser);
router.post('/login', checkLogin, authController.loginUser);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
