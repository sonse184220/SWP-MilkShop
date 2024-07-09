import { poolConnect } from '../utils/dbConnection.js';

export class BlacklistService {
    async addTokenToBlacklist(token, expiry) {
        const query = 'INSERT INTO TOKEN_BLACKLIST (Token, Expiry) VALUES (?, ?)';
        await poolConnect.query(query, [token, expiry]);
    }

    async isTokenBlacklisted(token) {
        const query = 'SELECT * FROM TOKEN_BLACKLIST WHERE Token = ?';
        const [results] = await poolConnect.query(query, [token]);
        return results.length > 0;
    }
}
