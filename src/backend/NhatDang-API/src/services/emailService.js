import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = (email, token, req) => {
    const url = `${req.protocol}://${req.get('host')}/api/reset-password?token=${token}`;
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

export const sendVerificationEmail = (email, token, userId, phone, req) => {
    const url = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Thank you for registering and joining our milk shop. Please verify your email by clicking the link below:\n\n${url}\n\nYour details:\nUserID: ${userId}\nPhone: ${phone}\nEmail: ${email}`
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log(`Verification email sent: ${info.response}`);
        })
        .catch(error => {
            console.error(`Error sending verification email: ${error}`);
        });
};

export const sendOrderConfirmationEmail = (email, orderId, cartItems, totalPrice, user, userDetails, callback) => {
    const itemsDetails = cartItems.map(item => `Product ID: ${item.ProductID}, Quantity: ${item.CartQuantity}, Price: ${item.Price}`).join('\n');
    const details = `Name: ${userDetails.Name}, Email: ${userDetails.Email}, Phone: ${userDetails.Phone}, Address: ${userDetails.Address}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Confirmation',
        text: `Thank you for your order. Here are the details of your order:\n\nOrder ID: ${orderId}\n${details}\n\nItems:\n${itemsDetails}\n\nTotal Price: ${totalPrice}`
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log(`Order confirmation email sent: ${info.response}`);
            callback(null, info);
        })
        .catch(error => {
            console.error(`Error sending order confirmation email: ${error}`);
            callback(error);
        });
};
