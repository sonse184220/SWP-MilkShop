import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { connection } from '../utils/dbConnection.js';
import { EmailService } from './emailService.js';

dotenv.config();

export class AuthService {
    constructor() {
        this.emailService = new EmailService();
    }

    registerUser = (userData, req, callback) => {
        const { Password, Name, Email, Phone, Address } = userData;

        const checkQuery = 'SELECT * FROM MEMBER WHERE Email = ?';
        connection.query(checkQuery, [Email], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                return callback(null, { message: 'User already exists with this Email', status: 400 });
            }

            const tempCheckQuery = 'SELECT * FROM TEMP_MEMBER WHERE Email = ?';
            connection.query(tempCheckQuery, [Email], (err, results) => {
                if (err) return callback(err);

                if (results.length > 0) {
                    return callback(null, { message: 'A verification email has already been sent to this Email.', status: 400 });
                }

                bcrypt.hash(Password, 10, (err, hashedPassword) => {
                    if (err) return callback(err);

                    const token = jwt.sign({ email: Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    const query = 'INSERT INTO TEMP_MEMBER (Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)';

                    connection.query(query, [hashedPassword, Name, Email, Phone, Address, token], (err, result) => {
                        if (err) return callback(err);

                        this.emailService.sendVerificationEmail(Email, token, result.insertId, Phone, req)
                            .then(() => {
                                console.log('Verification email sent to:', Email);
                                callback(null, { message: 'User registered successfully. Verification email sent.', token });
                            })
                            .catch(error => {
                                console.error('Error sending verification email:', error);
                                callback(error);
                            });
                    });
                });
            });
        });
    };

    loginUser = (userData, callback) => {
        const { identifier, Password } = userData;

        const query = 'SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?';
        connection.query(query, [identifier, identifier], (err, results) => {
            if (err) return callback(err);

            if (results.length === 0) {
                return callback(null, { message: 'Invalid credentials', status: 401 });
            }

            const user = results[0];

            bcrypt.compare(Password, user.Password, (err, isMatch) => {
                if (err) return callback(err);

                if (!isMatch) {
                    return callback(null, { message: 'Invalid credentials', status: 401 });
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
            const email = decoded.email;

            const selectQuery = 'SELECT * FROM TEMP_MEMBER WHERE Token = ?';
            connection.query(selectQuery, [token], (err, results) => {
                if (err) return callback(err);
                if (results.length === 0) return callback(null, { message: 'Invalid or expired token', status: 400 });

                const user = results[0];
                const getMaxUserIdQuery = 'SELECT MAX(CAST(SUBSTR(UserID, 2) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE "U%"';
                connection.query(getMaxUserIdQuery, (err, results) => {
                    if (err) return callback(err);

                    const newUserId = `U${(results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

                    const insertQuery = 'INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)';
                    const deleteQuery = 'DELETE FROM TEMP_MEMBER WHERE TempMemberID = ?';

                    connection.query(insertQuery, [newUserId, user.Password, user.Name, user.Email, user.Phone, user.Address], (err, result) => {
                        if (err) return callback(err);

                        connection.query(deleteQuery, [user.TempMemberID], (err, result) => {
                            if (err) return callback(err);
                            callback(null, { message: 'Email verified successfully', status: 200 });
                        });
                    });
                });
            });
        } catch (err) {
            callback(err);
        }
    };

    completeProfile = (req, callback) => {
        const { userId, name, phone, address } = req.body;
        const query = 'UPDATE MEMBER SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?';
        connection.query(query, [name, phone, address, userId], (err, result) => {
            if (err) return callback(err);
            callback(null, { message: 'Profile completed successfully' });
        });
    };
}
