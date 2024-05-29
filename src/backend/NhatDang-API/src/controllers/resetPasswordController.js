const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../utils/db');
const { sendResetPasswordEmail } = require('../services/emailService');
require('dotenv').config();

const requestResetPassword = (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM MEMBER WHERE Email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

        sendResetPasswordEmail(email, token, req)
            .then(() => {
                console.log('Reset password email sent to:', email);
                res.status(200).json({ message: 'Reset password email sent.' });
            })
            .catch(error => {
                console.error('Error sending reset password email:', error);
                res.status(500).json({ error: error.message });
            });
    });
};

const resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: err.message });

            const query = 'UPDATE MEMBER SET Password = ? WHERE UserID = ?';
            connection.query(query, [hashedPassword, userId], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json({ message: 'Password reset successfully.' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    requestResetPassword,
    resetPassword
};
