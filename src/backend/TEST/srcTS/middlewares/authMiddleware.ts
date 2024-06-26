import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { UserService } from '../services/userService.js';

const userService = new UserService();

dotenv.config();

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        req.user = decoded;
        next();
    });
};

export async function checkAuthMemberStaffAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated!' });
    }

    console.log(req.user);
}