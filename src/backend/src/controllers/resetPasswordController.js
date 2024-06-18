import { ResetPasswordService } from '../services/resetPasswordService.js';

const resetPasswordService = new ResetPasswordService();

class ResetPasswordController {
    requestResetPassword = (req, res) => {
        const { email } = req.body;
        resetPasswordService.requestResetPassword(email, req, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    resetPassword = (req, res) => {
        const { token, newPassword } = req.body;
        resetPasswordService.resetPassword(token, newPassword, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };
}

export const resetPasswordController = new ResetPasswordController();
