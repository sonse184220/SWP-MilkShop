const express = require('express');
const { registerUser, verifyEmail } = require('../services/authService');
const { checkRegister } = require('../middlewares/validationMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/register', checkRegister, (req, res) => {
    registerUser(req.body, req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.status) return res.status(result.status).json({ message: result.message });
        res.status(201).json(result);
    });
});

router.get('/verify-email', (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
    }

    verifyEmail(token, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.status) return res.status(result.status).json({ message: result.message });
        res.status(200).json(result);
    });
});

module.exports = router;
