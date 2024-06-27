import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const checkAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
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