import * as authService from '../services/authService.js';

export const registerUser = (req, res) => {
    authService.registerUser(req.body, req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 201).json(result);
    });
};

export const loginUser = (req, res) => {
    authService.loginUser(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
};

export const verifyEmail = (req, res) => {
    authService.verifyEmail(req.query.token, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
};

export const completeProfile = (req, res) => {
    authService.completeProfile(req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};
