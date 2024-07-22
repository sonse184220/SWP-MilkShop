import jwt from 'jsonwebtoken';
import { BlacklistService } from './blacklistService.js';

const blacklistService = new BlacklistService();

export class LogoutService {
    async logoutUser(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const expiry = new Date(decoded.exp * 1000);
            await blacklistService.addTokenToBlacklist(token, expiry);
            return { message: 'Logout successful' };
        } catch (err) {
            throw new Error('Invalid token');
        }
    }
}
