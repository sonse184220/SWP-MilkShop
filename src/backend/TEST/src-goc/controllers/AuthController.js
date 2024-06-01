import { EmailService } from "../services/EmailService.js";
import { poolConnect, connection } from "../utils/dbConnection.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {
    constructor() {
        this.emailService = new EmailService();
    }

    registerUser = (req, res) => {
        const { UserID, Password, Name, Email, Phone, Address } = req.body;

        const checkQuery = 'SELECT * FROM MEMBER WHERE UserID = ? OR Email = ? OR Phone = ?';
        connection.query(checkQuery, [UserID, Email, Phone], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

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
                return res.status(400).json({ message: errorMessage });
            }

            bcrypt.hash(Password, 10, (err, hashedPassword) => {
                if (err) return res.status(500).json({ error: err.message });

                const token = jwt.sign({ userId: UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const query = 'INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)';

                connection.query(query, [UserID, hashedPassword, Name, Email, Phone, Address, token], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    this.emailService.sendVerificationEmail(Email, token, UserID, Phone, req)
                        .then(() => {
                            console.log('Verification email sent to:', Email);
                            res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
                        })
                        .catch(error => {
                            console.error('Error sending verification email:', error);
                            res.status(500).json({ error: error.message });
                        });
                });
            });
        });
    };

    loginUser = (req, res) => {
        const { UserID, Password } = req.body;

        const query = 'SELECT * FROM MEMBER WHERE UserID = ?';
        connection.query(query, [UserID], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid UserID' });
            }

            const user = results[0];

            bcrypt.compare(Password, user.Password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: err.message });

                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid Password' });
                }

                const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

                const { Password, ...userWithoutPassword } = user;

                res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
            });
        });
    };

    verifyEmail = (req, res) => {
        const token = req.query.token;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            const selectQuery = 'SELECT * FROM TEMP_MEMBER WHERE Token = ?';
            connection.query(selectQuery, [token], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

                const user = results[0];
                const insertQuery = 'INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)';
                const deleteQuery = 'DELETE FROM TEMP_MEMBER WHERE UserID = ?';

                connection.query(insertQuery, [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    connection.query(deleteQuery, [user.UserID], (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.status(200).json({ message: 'Email verified successfully' });
                    });
                });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
