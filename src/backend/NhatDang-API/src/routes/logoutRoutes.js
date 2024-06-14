import express from 'express';
import { logout } from '../services/logoutService.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', checkAuthenticated, logout);

export default router;
