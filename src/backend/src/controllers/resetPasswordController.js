import { ResetPasswordService } from '../services/resetPasswordService.js';

export class ResetPasswordController {
    constructor() {
        this.resetPasswordService = new ResetPasswordService();
    }

    requestResetPassword = async (req, res) => {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        try {
            const result = await this.resetPasswordService.requestResetPassword(email, newPassword, req);
            res.status(result.status || 200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    verifyResetToken = async (req, res) => {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        try {
            const result = await this.resetPasswordService.resetPassword(token);
            res.redirect('http://localhost:3000/login-register');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export const resetPasswordController = new ResetPasswordController();
