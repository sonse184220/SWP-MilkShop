import { poolConnect } from '../utils/dbConnection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EmailService } from './EmailService.js';
import dotenv from 'dotenv';

dotenv.config();

export class ResetPasswordService {
    constructor() {
        this.emailService = new EmailService();
    }

    async requestResetPassword(email, newPassword, req) {
        try {
            const query = 'Select * from user WHERE Email = ?';
            const [results] = await poolConnect.query(query, [email]);
            if (results.length === 0) {
                throw new Error('Email not found');
            }

            const user = results[0];
            const token = jwt.sign({ userId: user.UserID, newPassword }, process.env.JWT_SECRET, { expiresIn: '1h' });

            await this.emailService.sendResetPasswordEmail(email, token, req);
            return { message: 'Reset password email sent.', token };
        } catch (error) {
            throw error;
        }
    };

    async resetPassword(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const userId = decoded.userId;
            const newPassword = decoded.newPassword;

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const query = 'Update user SET Password = ? wHERE UserID = ?';
            await poolConnect.query(query, [hashedPassword, userId]);

            return { message: 'Password reset successfully.' };
        } catch (error) {
            throw error;
        }
    }
}
