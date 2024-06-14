import * as authController from '../controllers/AuthController.js';

export const registerUser = (req, res) => {
    authController.registerUser(req.body, req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 201).json(result);
    });
};

export const loginUser = (req, res) => {
    authController.loginUser(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
};

export const verifyEmail = (req, res) => {
    authController.verifyEmail(req.query.token, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
};

export const completeProfile = (req, res) => {
    authController.completeProfile(req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};
