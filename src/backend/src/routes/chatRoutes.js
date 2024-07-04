import express from 'express';
import { ChatController } from '../controllers/chatController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();
const chatController = new ChatController();

router.post('/create-session', checkAuthenticated, (req, res) => chatController.createSession(req, res));
router.post('/assign-staff', checkAuthenticated, (req, res) => chatController.assignStaff(req, res));
router.get('/available-staff', checkAuthenticated, (req, res) => chatController.getAvailableStaff(req, res));
router.get('/history/:sessionID', checkAuthenticated, (req, res) => chatController.getChatHistory(req, res));
router.post('/message', checkAuthenticated, (req, res) => chatController.addChatMessage(req, res));

export { router as chatRoutes };
