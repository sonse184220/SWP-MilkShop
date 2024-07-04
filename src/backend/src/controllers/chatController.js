import { ChatService } from '../services/chatService.js';

const chatService = new ChatService();

export class ChatController {
    async createSession(req, res) {
        try {
            const userId = req.user.userId;
            const sessionId = await chatService.createSession(userId);
            res.json({ sessionId });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create session' });
        }
    }

    async assignStaff(req, res) {
        try {
            const { sessionId, staffId } = req.body;
            await chatService.assignStaff(sessionId, staffId);
            res.json({ message: 'Staff assigned to session' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to assign staff' });
        }
    }

    async getSession(req, res) {
        try {
            const sessionId = req.params.id;
            const session = await chatService.getSession(sessionId);
            res.json(session);
        } catch (err) {
            res.status(500).json({ error: 'Failed to get session' });
        }
    }

    async getMessages(req, res) {
        try {
            const sessionId = req.params.id;
            const messages = await chatService.getMessages(sessionId);
            res.json(messages);
        } catch (err) {
            res.status(500).json({ error: 'Failed to get messages' });
        }
    }
}
