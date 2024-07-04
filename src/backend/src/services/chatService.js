import { connection, poolConnect } from '../utils/dbConnection.js';

export class ChatService {
    async createSession(userId) {
        const [result] = await poolConnect.query('INSERT INTO ChatSession (UserID, status) VALUES (?, "busy")', [userId]);
        return result.insertId;
    }

    async assignStaff(sessionId, staffId) {
        await poolConnect.query('UPDATE ChatSession SET StaffID = ?, status = "active" WHERE SessionID = ?', [staffId, sessionId]);
    }

    async getSession(sessionId) {
        const [result] = await poolConnect.query('SELECT * FROM ChatSession WHERE SessionID = ?', [sessionId]);
        return result[0];
    }

    async saveMessage(sessionId, senderId, message) {
        await poolConnect.query('INSERT INTO ChatMessage (SessionID, SenderID, Message) VALUES (?, ?, ?)', [sessionId, senderId, message]);
    }

    async getMessages(sessionId) {
        const [messages] = await poolConnect.query('SELECT * FROM ChatMessage WHERE SessionID = ?', [sessionId]);
        return messages;
    }
}
