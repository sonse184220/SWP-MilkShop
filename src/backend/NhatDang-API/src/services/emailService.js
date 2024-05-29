const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetPasswordEmail = (email, token, req) => {
    const url = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password',
        text: `You requested to reset your password. Click the link below to reset your password:\n\n${url}`
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log(`Email sent: ${info.response}`);
        })
        .catch(error => {
            console.error(`Error sending email: ${error}`);
        });
};

const sendVerificationEmail = (email, token, userId, phone, req) => {
    const url = `${req.protocol}://${req.get('host')}/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Thank you for registering and join our milk shop. Please verify your email by clicking the link below:\n\n${url}\n\nYour details:\nUserID: ${userId}\nPhone: ${phone}\nEmail: ${email}`
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log(`Verification email sent: ${info.response}`);
        })
        .catch(error => {
            console.error(`Error sending verification email: ${error}`);
        });
};

module.exports = {
    sendResetPasswordEmail,
    sendVerificationEmail
};
