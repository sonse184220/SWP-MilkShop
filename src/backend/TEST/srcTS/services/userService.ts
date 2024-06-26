import { connection } from '../utils/dbConnection.js';
import { poolConnect } from '../utils/dbConnection.js';
import { RowDataPacket } from 'mysql2';

export class UserService {
    // getUserInfo = (userId: string, callback: any[]) => {
    //     const query = 'SELECT UserID, Name, Email, Phone, Address, RewardPoints, Verified FROM MEMBER WHERE UserID = ?';
    //     connection.query(query, [userId], callback);
    // };

    async checkUserExisted(id: string) {
        const [member] = await poolConnect.query('SELECT * FROM member WHERE UserID = ?', [id]);
        return member as RowDataPacket[];
    }

    // updateUserInfo = (userId: string, newUserData: any, callback: any) => {
    //     this.getUserInfo(userId, (err, results) => {
    //         if (err) return callback(err);
    //         if (results.length === 0) return callback(new Error('User not found'));

    //         const currentUserData = results[0];
    //         const fieldsToUpdate = [];
    //         const values = [];

    //         if (newUserData.Name && newUserData.Name.trim() !== currentUserData.Name) {
    //             fieldsToUpdate.push('Name = ?');
    //             values.push(newUserData.Name.trim());
    //         }
    //         if (newUserData.Email && newUserData.Email.trim() !== currentUserData.Email) {
    //             fieldsToUpdate.push('Email = ?');
    //             values.push(newUserData.Email.trim());
    //         }
    //         if (newUserData.Phone && newUserData.Phone.trim() !== currentUserData.Phone) {
    //             fieldsToUpdate.push('Phone = ?');
    //             values.push(newUserData.Phone.trim());
    //         }
    //         if (newUserData.Address && newUserData.Address.trim() !== currentUserData.Address) {
    //             fieldsToUpdate.push('Address = ?');
    //             values.push(newUserData.Address.trim());
    //         }

    //         if (fieldsToUpdate.length === 0) {
    //             return callback(null, { message: 'No fields to update', status: 400 });
    //         }

    //         const query = `UPDATE MEMBER SET ${fieldsToUpdate.join(', ')} WHERE UserID = ?`;
    //         values.push(userId);

    //         connection.query(query, values, (err, result) => {
    //             if (err) return callback(err);

    //             this.getUserInfo(userId, (err, updatedResults) => {
    //                 if (err) return callback(err);
    //                 callback(null, { message: 'User updated successfully', user: updatedResults[0] });
    //             });
    //         });
    //     });
    // };

}
