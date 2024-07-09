import sharp from 'sharp';
import bcrypt from 'bcryptjs';
import { connection, poolConnect } from '../utils/dbConnection.js';

export class UserService {
    async getUserInfo(userId) {
        const query = 'select UserID, Name, Email, Phone, Address, RewardPoints, Verified, ProfilePicture FROM user WHERE UserID = ?';
        const [results] = await poolConnect.query(query, [userId]);
        return results[0];
    }

    async checkUserExisted(id) {
        const [user] = await poolConnect.query('Select * FROM user WHERE UserID = ?', [id]);
        return user;
    }

    async updateUserInfo(userId, newUserData) {
        const currentUserData = await this.getUserInfo(userId);
        if (!currentUserData) {
            throw new Error('User not found');
        }

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
            const resizedImageBuffer = await sharp(newUserData.ProfilePicture)
                .resize(480, 320)
                .toBuffer();
            fieldsToUpdate.push('ProfilePicture = ?');
            values.push(resizedImageBuffer);
        }

        if (fieldsToUpdate.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `Update user SET ${fieldsToUpdate.join(', ')} WHERe UserID = ?`;
        values.push(userId);
        await poolConnect.query(query, values);

        const updatedUser = await this.getUserInfo(userId);
        return { message: 'User updated successfully', user: updatedUser };
    }

    async changePassword(userId, oldPassword, newPassword) {
        const query = 'Select Password FROM user WHERE UserID = ?';
        const [results] = await poolConnect.query(query, [userId]);

        if (results.length === 0) {
            throw new Error('User not found');
        }

        const storedPassword = results[0].Password;
        const isMatch = await bcrypt.compare(oldPassword, storedPassword);
        if (!isMatch) {
            throw new Error('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'Update user SET Password = ? WHERE UserID = ?';
        await poolConnect.query(updateQuery, [hashedPassword, userId]);

        return { message: 'Password changed successfully' };
    }

    async updateUserRewardPoints(userId, amount) {
        const [user] = await poolConnect.query(`UPDATE user SET RewardPoints = RewardPoints + ? WHERE UserID = ?`, [amount, userId]);
        return user;
    }
}
