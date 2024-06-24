import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const checkAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

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

export function getAuthRole(req, res, next) {
    const adminPattern = /^A\d+$/;
    const staffPattern = /^S\d+$/;
    const memberPattern = /^U\d+$/;

    if (adminPattern.test(req.user.userId)) {
        req.userRole = "admin";
        return next();
    }

    if (staffPattern.test(req.user.userId)) {
        req.userRole = "staff";
        return next();
    }

    if (memberPattern.test(req.user.userId)) {
        req.userRole = "member";
        return next();
    }

    req.userRole = "guest";
    return next();
}