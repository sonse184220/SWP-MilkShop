import { poolConnect } from '../utils/dbConnection.js';
export class UserService {
    // getUserInfo = (userId: string, callback: any[]) => {
    //     const query = 'SELECT UserID, Name, Email, Phone, Address, RewardPoints, Verified FROM MEMBER WHERE UserID = ?';
    //     connection.query(query, [userId], callback);
    // };
    async checkUserExisted(id) {
        const [member] = await poolConnect.query('SELECT * FROM member WHERE UserID = ?', [id]);
        return member;
    }
}
