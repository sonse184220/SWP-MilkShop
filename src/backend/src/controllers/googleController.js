import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GoogleService } from '../services/googleService.js';

dotenv.config();
const googleService = new GoogleService();

export class GoogleController {
    async handleGoogleCallback(req, res) {
        const user = req.user;

        const tempUserToken = jwt.sign({ email: user.Email, name: user.Name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const token = jwt.sign({
            userId: user.UserID,
            isAdmin: user.isAdmin,
            isStaff: user.isStaff
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.send({
            message: 'Google authentication successful.',
            token,
            user: {
                UserID: user.UserID,
                Name: user.Name,
                Email: user.Email,
                Phone: user.Phone,
                Address: user.Address,
                RewardPoints: user.RewardPoints
            }
        });
    }

    async completeRegistration(req, res) {
        const bearerHeader = req.headers['authorization'];

        if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
            return res.status(400).json({ error: 'Bearer token is missing or invalid' });
        }

        const tempUserToken = bearerHeader.split(' ')[1];

        console.log('Received Token:', tempUserToken);

        const { Name, Phone, Address } = req.body;
        const ProfilePicture = req.file ? req.file.buffer.toString('base64') : null;

        try {
            const tempUser = jwt.verify(tempUserToken, process.env.JWT_SECRET);
            console.log('Decoded Token:', tempUser);

            const createdUser = await googleService.createUser(tempUser.email, Name, Phone, Address, ProfilePicture);

            const token = jwt.sign({
                userId: createdUser.UserID,
                isAdmin: createdUser.isAdmin,
                isStaff: createdUser.isStaff
            }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.send({
                message: 'Registration complete. You can now log in.',
                token,
                user: createdUser
            });
        } catch (err) {
            console.error('Token Verification Error:', err);  // Log lỗi
            res.status(400).json({ error: 'Invalid token. Please start the registration process again.' });
        }
    }
}
