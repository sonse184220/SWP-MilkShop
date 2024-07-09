import { poolConnect } from '../utils/dbConnection.js';

export class GoogleService {
    async getUserByEmail(email) {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [results] = await poolConnect.query(query, [email]);
        return results.length > 0 ? results[0] : null;
    }

    async createUser(email, name, phone, address, profilePicture) {
        const getMaxUserIdQuery = 'SELECT MAX(CAST(SUBSTRING(UserID, 2) AS UNSIGNED)) AS maxUserId FROM `user` WHERE UserID LIKE "U%"';
        const [maxUserIdResults] = await poolConnect.query(getMaxUserIdQuery);
        const newUserId = `U${(maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

        const insertQuery = 'INSERT INTO user (UserID, Email, Name, Phone, Address, ProfilePicture, RewardPoints, Verified, activeStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await poolConnect.query(insertQuery, [newUserId, email, name, phone, address, profilePicture, 0, 1, 'active']);

        return newUserId;
    }
}
