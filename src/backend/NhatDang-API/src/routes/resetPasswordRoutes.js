const express = require('express');
const { requestResetPassword, resetPassword } = require('../controllers/resetPasswordController');
const { checkResetPasswordRequest, checkResetPassword } = require('../middlewares/validationMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/request-reset', checkResetPasswordRequest, requestResetPassword);
router.post('/reset', checkResetPassword, resetPassword);

module.exports = router;
