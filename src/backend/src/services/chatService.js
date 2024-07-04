import { connection, poolConnect } from '../utils/dbConnection.js';

export class ChatService {
    async createChatSession(userId) {
        const [existingSession] = await poolConnect.query(
            'SELECT * FROM ChatSession WHERE UserID = ? AND status IN ("active", "busy")',
            [userId]
        );
        if (existingSession.length > 0) {
            return existingSession[0];
        }

        const [newSession] = await poolConnect.query(
            'INSERT INTO ChatSession (UserID, status) VALUES (?, "busy")',
            [userId]
        );
        return { SessionID: newSession.insertId };
    }

    async assignStaffToSession(sessionID, staffId) {
        await poolConnect.query(
            'UPDATE ChatSession SET StaffID = ?, status = "active" WHERE SessionID = ?',
            [staffId, sessionID]
        );
    }

    async getChatSession(sessionID) {
        const [session] = await poolConnect.query(
            'SELECT * FROM ChatSession WHERE SessionID = ?',
            [sessionID]
        );
        return session[0];
    }

    async getAvailableStaff() {
        const [staff] = await poolConnect.query(
            'SELECT * FROM user WHERE isStaff = 1 AND UserID NOT IN (SELECT StaffID FROM ChatSession WHERE status IN ("active", "busy"))'
        );
        return staff;
    }

    async addChatMessage(sessionID, userId, message) {
        await poolConnect.query(
            'INSERT INTO Chat (SessionID, UserID, Message, Timestamp) VALUES (?, ?, ?, NOW())',
            [sessionID, userId, message]
        );
    }

    async getChatHistory(sessionID) {
        const [messages] = await poolConnect.query(
            'SELECT * FROM Chat WHERE SessionID = ? ORDER BY Timestamp',
            [sessionID]
        );
        return messages;
    }
}
