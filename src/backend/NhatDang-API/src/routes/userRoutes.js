import express from 'express';
import { getUserInfo, updateUserInfo, completeProfile } from '../services/userService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/:userId', getUserInfo);
router.put('/:userId', updateUserInfo);
router.post('/complete-profile', completeProfile);

export default router;
