const express = require('express');
const resetPasswordService = require('../services/resetPasswordService');
require('dotenv').config();

const router = express.Router();

router.post('/request-reset-password', resetPasswordService.requestResetPassword);
router.post('/reset-password', resetPasswordService.resetPassword);

module.exports = router;
