import { poolConnect, connection } from "../utils/dbConnection.js";
import { EmailService } from "./EmailService.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
    constructor() {
        this.emailService = new EmailService();
    }

    registerUser = (userData, req, callback) => {
        const { UserID, Password, Name, Email, Phone, Address } = userData;

        const checkQuery = 'SELECT * FROM MEMBER WHERE UserID = ? OR Email = ? OR Phone = ?';
        connection.query(checkQuery, [UserID, Email, Phone], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                const existingUser = results[0];
                let errorMessage = 'User already exists with ';
                if (existingUser.UserID === UserID) {
                    errorMessage += 'this UserID';
                } else if (existingUser.Email === Email) {
                    errorMessage += 'this Email';
                } else if (existingUser.Phone === Phone) {
                    errorMessage += 'this Phone number';
                }
                return callback(null, { message: errorMessage, status: 400 });
            }

            bcrypt.hash(Password, 10, (err, hashedPassword) => {
                if (err) return callback(err);

                const token = jwt.sign({ userId: UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const query = 'INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)';

                connection.query(query, [UserID, hashedPassword, Name, Email, Phone, Address, token], (err, result) => {
                    if (err) return callback(err);

                    this.emailService.sendVerificationEmail(Email, token, UserID, Phone, req)
                        .then(() => {
                            console.log('Verification email sent to:', Email);
                            callback(null, { message: 'User registered successfully. Verification email sent.' });
                        })
                        .catch(error => {
                            console.error('Error sending verification email:', error);
                            callback(error);
                        });
                });
            });
        });
    };

    loginUser = (userData, callback) => {
        const { UserID, Password } = userData;

        const query = 'SELECT * FROM MEMBER WHERE UserID = ?';
        connection.query(query, [UserID], (err, results) => {
            if (err) return callback(err);

            if (results.length === 0) {
                return callback(null, { message: 'Invalid UserID', status: 401 });
            }

            const user = results[0];

            bcrypt.compare(Password, user.Password, (err, isMatch) => {
                if (err) return callback(err);

                if (!isMatch) {
                    return callback(null, { message: 'Invalid Password', status: 401 });
                }

                const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const { Password, ...userWithoutPassword } = user;
                callback(null, { message: 'Login successful', token, user: userWithoutPassword });
            });
        });
    };

    verifyEmail = (token, callback) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            const selectQuery = 'SELECT * FROM TEMP_MEMBER WHERE Token = ?';
            connection.query(selectQuery, [token], (err, results) => {
                if (err) return callback(err);
                if (results.length === 0) return callback(null, { message: 'Invalid or expired token', status: 400 });

                const user = results[0];
                const insertQuery = 'INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)';
                const deleteQuery = 'DELETE FROM TEMP_MEMBER WHERE UserID = ?';

                connection.query(insertQuery, [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address], (err, result) => {
                    if (err) return callback(err);

                    connection.query(deleteQuery, [user.UserID], (err, result) => {
                        if (err) return callback(err);
                        callback(null, { message: 'Email verified successfully' });
                    });
                });
            });
        } catch (err) {
            callback(err);
        }
    };
}
