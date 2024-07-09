import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BlacklistService } from '../services/blacklistService.js';

dotenv.config();
const blacklistService = new BlacklistService();

export const checkAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = { userId: 'guest' };
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        if (await blacklistService.isTokenBlacklisted(token)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const checkChatAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = { userId: 'guest' };
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        if (await blacklistService.isTokenBlacklisted(token)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
