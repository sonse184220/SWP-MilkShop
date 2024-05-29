const express = require('express');
const { requestResetPassword, resetPassword } = require('../services/resetPasswordService');
const { checkResetPasswordRequest, checkResetPassword } = require('../middlewares/validationMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/request-reset', checkResetPasswordRequest, (req, res) => {
    const { email } = req.body;
    requestResetPassword(email, req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
});

router.post('/reset', checkResetPassword, (req, res) => {
    const { token, newPassword } = req.body;
    resetPassword(token, newPassword, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
});

module.exports = router;
