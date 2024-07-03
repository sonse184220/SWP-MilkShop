import jwt from 'jsonwebtoken';
import { connection } from '../utils/dbConnection.js';
import dotenv from 'dotenv';

dotenv.config();

export class GoogleAuthService {
    googleAuthCallback(profile, callback) {
        const email = profile.emails[0].value;

        const checkQuery = 'SELECT * FROM user WHERE Email = ?';
        connection.query(checkQuery, [email], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                const user = results[0];
                const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return callback(null, { token, user });
            }

            const getMaxUserIdQuery = "SELECT MAX(CAST(SUBSTR(UserID, 3) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE 'UG%'";
            connection.query(getMaxUserIdQuery, (err, results) => {
                if (err) return callback(err);

                const newUserId = `UG${(results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;
                const newUser = {
                    UserID: newUserId,
                    Name: profile.displayName || '',
                    Email: email,
                    Phone: '',
                    Address: '',
                    RewardPoints: 0,
                    Verified: 1
                };

                const query = 'INSERT INTO TEMP_MEMBER (UserID, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)';
                const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

                connection.query(query, [newUserId, newUser.Name, newUser.Email, newUser.Phone, newUser.Address, token], (err, result) => {
                    if (err) return callback(err);
                    callback(null, { newUser: true, token });
                });
            });
        });
    }

    completeProfile(userId, name, phone, address, callback) {
        const query = 'UPDATE user SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?';
        connection.query(query, [name, phone, address, userId], (err, result) => {
            if (err) return callback(err);
            callback(null, { message: 'Profile completed successfully' });
        });
    }
}
