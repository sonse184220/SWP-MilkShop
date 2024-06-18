import { ResetPasswordService } from '../services/resetPasswordService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class ResetPasswordController {
    constructor() {
        this.resetPasswordService = new ResetPasswordService();
    }

    requestResetPassword = (req, res) => {
        const { email } = req.body;
        this.resetPasswordService.requestResetPassword(email, req, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    resetPassword = (req, res) => {
        const { newPassword } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            this.resetPasswordService.resetPassword(token, newPassword, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(result.status || 200).json(result);
            });
        } catch (err) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}

export const resetPasswordController = new ResetPasswordController();
