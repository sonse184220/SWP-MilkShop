import express from 'express';
import { ChatController } from '../controllers/chatController.js';
import { checkChatAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();
const chatController = new ChatController();

router.post('/create-session', checkChatAuthenticated, (req, res) => chatController.createSession(req, res));
router.post('/assign-staff', checkChatAuthenticated, (req, res) => chatController.assignStaff(req, res));
router.get('/session/:id', checkChatAuthenticated, (req, res) => chatController.getSession(req, res));
router.get('/messages/:id', checkChatAuthenticated, (req, res) => chatController.getMessages(req, res));

export { router as chatRoutes };
