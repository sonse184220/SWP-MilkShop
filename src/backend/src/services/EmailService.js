import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    sendResetPasswordEmail = (email, token, req) => {
        const url = `${req.protocol}://${req.get('host')}/api/reset-password?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `You requested to reset your password. Click the link below to reset your password:\n\n${url}`
        };

        return this.transporter.sendMail(mailOptions)
            .then(info => {
                console.log(`Email sent: ${info.response}`);
            })
            .catch(error => {
                console.error(`Error sending email: ${error}`);
            });
    };

    sendVerificationEmail = (email, token, userId, phone, req) => {
        const url = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333;">Welcome to Milk Shop!</h2>
                    <p style="font-size: 16px; color: #333;">Thank you for registering. Please verify your email by clicking the button below:</p>
                    <div style="text-align: center;">
                        <a href="${url}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    </div>
                    <p style="font-size: 16px; color: #333;">Your details:</p>
                    <ul style="font-size: 16px; color: #333;">
                        <li>UserID: ${userId}</li>
                        <li>Phone: ${phone}</li>
                        <li>Email: ${email}</li>
                    </ul>
                </div>
            `
        };

        return this.transporter.sendMail(mailOptions)
            .then(info => {
                console.log(`Verification email sent: ${info.response}`);
            })
            .catch(error => {
                console.error(`Error sending verification email: ${error}`);
            });
    };


    sendOrderConfirmationEmail = (email, orderId, cartItems, totalPrice, user, contactInfo, callback) => {
        const itemsDetails = cartItems.map(item => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.ProductID}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.CartQuantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.Price}</td>
            </tr>`).join('');

        const userDetails = `Name: ${contactInfo.Name}, Email: ${contactInfo.Email}, Phone: ${contactInfo.Phone}, Address: ${contactInfo.Address}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333;">Thank You for Your Order!</h2>
                    <p style="font-size: 16px; color: #333;">Here are the details of your order:</p>
                    <ul style="font-size: 16px; color: #333;">
                        <li>Order ID: ${orderId}</li>
                        <li>${userDetails}</li>
                    </ul>
                    <p style="font-size: 16px; color: #333;">Items:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 8px; border: 1px solid #ddd;">Product ID</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsDetails}
                        </tbody>
                    </table>
                    <p style="font-size: 16px; color: #333;">Total Price: ${totalPrice}</p>
                </div>
            `
        };

        return this.transporter.sendMail(mailOptions)
            .then(info => {
                console.log(`Order confirmation email sent: ${info.response}`);
                callback(null, info);
            })
            .catch(error => {
                console.error(`Error sending order confirmation email: ${error}`);
                callback(error);
            });
    };

}
