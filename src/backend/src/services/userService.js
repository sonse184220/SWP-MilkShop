import sharp from 'sharp';
import bcrypt from 'bcryptjs';
import { connection } from '../utils/dbConnection.js';

export class UserService {
    getUserInfo = (userId, callback) => {
        const query = 'SELECT UserID, Name, Email, Phone, Address, RewardPoints, Verified, ProfilePicture FROM MEMBER WHERE UserID = ?';
        connection.query(query, [userId], callback);
    };

    async checkUserExisted(id) {
        const [member] = await poolConnect.query('SELECT * FROM member WHERE UserID = ?', [id]);
        return member;
    }

    updateUserInfo = (userId, newUserData, callback) => {
        this.getUserInfo(userId, async (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(new Error('User not found'));

            const currentUserData = results[0];
            const fieldsToUpdate = [];
            const values = [];

            if (newUserData.Name && newUserData.Name.trim() !== currentUserData.Name) {
                fieldsToUpdate.push('Name = ?');
                values.push(newUserData.Name.trim());
            }
            if (newUserData.Email && newUserData.Email.trim() !== currentUserData.Email) {
                fieldsToUpdate.push('Email = ?');
                values.push(newUserData.Email.trim());
            }
            if (newUserData.Phone && newUserData.Phone.trim() !== currentUserData.Phone) {
                fieldsToUpdate.push('Phone = ?');
                values.push(newUserData.Phone.trim());
            }
            if (newUserData.Address && newUserData.Address.trim() !== currentUserData.Address) {
                fieldsToUpdate.push('Address = ?');
                values.push(newUserData.Address.trim());
            }
            if (newUserData.ProfilePicture) {
                try {
                    const resizedImageBuffer = await sharp(newUserData.ProfilePicture)
                        .resize(480, 320)
                        .toBuffer();
                    fieldsToUpdate.push('ProfilePicture = ?');
                    values.push(resizedImageBuffer);
                } catch (err) {
                    return callback(err);
                }
            }

            if (fieldsToUpdate.length === 0) {
                return callback(null, { message: 'No fields to update', status: 400 });
            }

            const query = `UPDATE MEMBER SET ${fieldsToUpdate.join(', ')} WHERE UserID = ?`;
            values.push(userId);

            connection.query(query, values, (err, result) => {
                if (err) return callback(err);

                this.getUserInfo(userId, (err, updatedResults) => {
                    if (err) return callback(err);
                    callback(null, { message: 'User updated successfully', user: updatedResults[0] });
                });
            });
        });
    };

    changePassword = (userId, oldPassword, newPassword, callback) => {
        const query = 'SELECT Password FROM MEMBER WHERE UserID = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(new Error('User not found'));

            const storedPassword = results[0].Password;
            bcrypt.compare(oldPassword, storedPassword, (err, isMatch) => {
                if (err) return callback(err);
                if (!isMatch) return callback(new Error('Old password is incorrect'));

                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) return callback(err);

                    const updateQuery = 'UPDATE MEMBER SET Password = ? WHERE UserID = ?';
                    connection.query(updateQuery, [hashedPassword, userId], (err, result) => {
                        if (err) return callback(err);
                        callback(null, { message: 'Password changed successfully' });
                    });
                });
            });
        });
    };
}
