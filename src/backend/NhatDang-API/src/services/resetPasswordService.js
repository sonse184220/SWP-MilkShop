const resetPasswordController = require('../controllers/resetPasswordController');

const requestResetPassword = (req, res) => {
    const { email } = req.body;
    resetPasswordController.requestResetPassword(email, req, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
};

const resetPassword = (req, res) => {
    const { token, newPassword } = req.body;
    resetPasswordController.resetPassword(token, newPassword, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(result.status || 200).json(result);
    });
};

module.exports = {
    requestResetPassword,
    resetPassword
};
