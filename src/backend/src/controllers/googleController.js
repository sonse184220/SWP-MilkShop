import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GoogleService } from '../services/googleService.js';

dotenv.config();
const googleService = new GoogleService();

export class GoogleController {
    async handleGoogleCallback(req, res) {
        const user = req.user;

        const tempUserToken = jwt.sign({ email: user.Email, name: user.Name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Gửi JWT này cho frontend để hoàn tất đăng ký
        res.send({ tempUserToken, message: 'Google authentication successful. Please complete your registration.' });
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

            await googleService.createUser(tempUser.email, Name, Phone, Address, ProfilePicture);

            res.send('Registration complete. You can now log in.');
        } catch (err) {
            console.error('Token Verification Error:', err);  // Log lỗi
            res.status(400).json({ error: 'Invalid token. Please start the registration process again.' });
        }
    }
}
