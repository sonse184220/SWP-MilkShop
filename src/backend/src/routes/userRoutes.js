import express from 'express';
import { UserController } from '../controllers/userController.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const userController = new UserController();

router.get('/:userId', userController.getUserInfo);
router.put('/:userId', userController.updateUserInfo);

export { router as userRoutes };
