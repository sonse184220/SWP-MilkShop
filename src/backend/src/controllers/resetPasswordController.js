import { ResetPasswordService } from '../services/resetPasswordService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class ResetPasswordController {
    constructor() {
        this.resetPasswordService = new ResetPasswordService();
    }

    requestResetPassword = (req, res) => {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        this.resetPasswordService.requestResetPassword(email, newPassword, req, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    verifyResetToken = (req, res) => {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        this.resetPasswordService.resetPassword(token, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.redirect('http://localhost:3000/login-register');
        });
    };
}

export const resetPasswordController = new ResetPasswordController();
