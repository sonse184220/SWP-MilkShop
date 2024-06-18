import { GoogleAuthService } from '../services/googleService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class GoogleController {
    constructor() {
        this.googleAuthService = new GoogleAuthService();
    }

    googleAuthCallback = (req, res) => {
        this.googleAuthService.googleAuthCallback(req.user, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.newUser) {
                res.json({ token: result.token, message: 'Profile completion required' });
            } else {
                res.status(200).json(result);
            }
        });
    };

    completeProfile = (req, res) => {
        const { name, phone, address } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            this.googleAuthService.completeProfile(userId, name, phone, address, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json(result);
            });
        } catch (err) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}

export const googleController = new GoogleController();
