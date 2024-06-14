const express = require('express');
const resetPasswordService = require('../services/resetPassWordService');
require('dotenv').config();

const router = express.Router();

router.post('/request-reset-password', resetPasswordService.requestResetPassword);
router.post('/reset-password', resetPasswordService.resetPassword);

module.exports = router;
