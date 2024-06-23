import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserService } from '../services/userService.js';
const userService = new UserService();
dotenv.config();
export const checkAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }
        req.user = decoded;
        next();
    });
};
export async function checkAuthMemberStaffAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated!' });
    }
    console.log(req.user);
}
