import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { poolConnect } from '../utils/dbConnection.js';
import { EmailService } from './EmailService.js';

dotenv.config();

export class AuthService {
    constructor() {
        this.emailService = new EmailService();
    }

    async registerUser(userData, req) {
        const { Password, Name, Email, Phone, Address } = userData;

        const checkQuery = 'Select * from `user` WHERE Email = ?';
        const [results] = await poolConnect.query(checkQuery, [Email]);
        if (results.length > 0) {
            throw new Error('User already exists with this Email');
        }

        const tempCheckQuery = 'Select * from `TEMP_USER` WHERE Email = ?';
        const [tempResults] = await poolConnect.query(tempCheckQuery, [Email]);
        if (tempResults.length > 0) {
            throw new Error('A verification email has already been sent to this Email.');
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const token = jwt.sign({ email: Email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const query = 'Insert INTO `TEMP_USER` (Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)';

        const [result] = await poolConnect.query(query, [hashedPassword, Name, Email, Phone, Address, token]);

        await this.emailService.sendVerificationEmail(Email, token, result.insertId, Phone, req);
        return { message: 'User registered successfully. Verification email sent.', token };
    }

    async loginUser(userData) {
        const { identifier, Password } = userData;

        const query = 'SELECT * FROM `user` WHERE Email = ? OR Phone = ?';
        const [results] = await poolConnect.query(query, [identifier, identifier]);
        if (results.length === 0) {
            throw new Error('Invalid credentials');
        }

        const user = results[0];

        if (user.activeStatus === 'inactive') {
            throw new Error('Account is inactive. Please contact support.');
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({
            userId: user.UserID,
            isAdmin: user.isAdmin,
            isStaff: user.isStaff
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const { Password: userPassword, ...userWithoutPassword } = user;
        return { message: 'Login successful', token, user: userWithoutPassword };
    }

    async verifyEmail(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const selectQuery = 'Select * FROM `TEMP_USER` WHERE Token = ?';
        const [results] = await poolConnect.query(selectQuery, [token]);
        if (results.length === 0) {
            throw new Error('Invalid or expired token');
        }

        const user = results[0];
        const getMaxUserIdQuery = 'Select MAX(CAST(SUBSTRING(UserID, 2) AS UNSIGNED)) as maxUserId FROM `user` WHERE UserID LIKE "U%"';
        const [maxUserIdResults] = await poolConnect.query(getMaxUserIdQuery);

        const newUserId = `U${(maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

        const insertQuery = 'Insert INTO `user` (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified, isAdmin, isStaff, activeStatus) VALUES (?, ?, ?, ?, ?, ?, 0, 1, 0, 0, "active")';
        const deleteQuery = 'Delete FROM `TEMP_USER` WHERE TempUserID = ?';

        await poolConnect.query(insertQuery, [newUserId, user.Password, user.Name, user.Email, user.Phone, user.Address]);
        await poolConnect.query(deleteQuery, [user.TempUserID]);

        return { message: 'Email verified successfully', status: 200 };
    }

    async registerAdmin(userData) {
        const { Password, Name, Email, Phone, Address } = userData;

        const checkQuery = 'Select * From `user` WHERE Email = ?';
        const [results] = await poolConnect.query(checkQuery, [Email]);
        if (results.length > 0) {
            throw new Error('User already exists with this Email');
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const getMaxUserIdQuery = 'Select MAX(CAST(SUBSTRING(UserID, 2) AS UNSIGNED)) as maxUserId FROM `user` WHERE UserID LIKE "U%"';
        const [maxUserIdResults] = await poolConnect.query(getMaxUserIdQuery);

        const newUserId = `U${(maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

        const query = 'Insert INTO `user` (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified, isAdmin, isStaff, activeStatus) VALUES (?, ?, ?, ?, ?, ?, 0, 1, 1, 0, "active")';
        await poolConnect.query(query, [newUserId, hashedPassword, Name, Email, Phone, Address]);

        return { message: 'Admin registered successfully', status: 201 };
    }

    async createStaff(userData) {
        const { Password, Name, Email, Phone, Address } = userData;

        const checkQuery = 'Select * FROM `user` WHERE Email = ?';
        const [results] = await poolConnect.query(checkQuery, [Email]);
        if (results.length > 0) {
            throw new Error('User already exists with this Email');
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const getMaxUserIdQuery = 'Select MAX(CAST(SUBSTRING(UserID, 2) AS UNSIGNED)) AS maxUserId FROM `user` WHERE UserID LIKE "U%"';
        const [maxUserIdResults] = await poolConnect.query(getMaxUserIdQuery);

        const newUserId = `U${(maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

        const query = 'Insert INTO `user` (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified, isAdmin, isStaff, activeStatus) VALUES (?, ?, ?, ?, ?, ?, 0, 1, 0, 1, "active")';
        await poolConnect.query(query, [newUserId, hashedPassword, Name, Email, Phone, Address]);

        return { message: 'Staff created successfully', status: 201 };
    }
}
