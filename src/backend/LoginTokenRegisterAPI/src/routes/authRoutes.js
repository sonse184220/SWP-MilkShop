const express = require('express');
const { registerUser, loginUser } = require('../services/authService');
const { checkRegister, checkLogin } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', checkRegister, (req, res) => {
    registerUser(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
});

router.post('/login', checkLogin, (req, res) => {
    loginUser(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.status) return res.status(result.status).json({ message: result.message });
        res.status(200).json(result);
    });
});

module.exports = router;
