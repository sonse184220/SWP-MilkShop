import { ChatService } from '../services/chatService.js';

const chatService = new ChatService();

export class ChatController {
    async createSession(req, res) {
        try {
            const { userId } = req.body;
            const session = await chatService.createChatSession(userId);
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async assignStaff(req, res) {
        try {
            const { sessionID, staffId } = req.body;
            await chatService.assignStaffToSession(sessionID, staffId);
            res.status(200).json({ message: 'Staff assigned successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAvailableStaff(req, res) {
        try {
            const staff = await chatService.getAvailableStaff();
            res.status(200).json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getChatHistory(req, res) {
        try {
            const { sessionID } = req.params;
            const history = await chatService.getChatHistory(sessionID);
            res.status(200).json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addChatMessage(req, res) {
        try {
            const { sessionID, userId, message } = req.body;
            await chatService.addChatMessage(sessionID, userId, message);
            res.status(200).json({ message: 'Message added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
