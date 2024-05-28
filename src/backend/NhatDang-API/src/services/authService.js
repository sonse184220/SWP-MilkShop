// NodeJS-Session01/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../utils/db');

const registerUser = (userData, callback) => {
    const { UserID, Password, Name, Email, Phone, Address } = userData;
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        const RewardPoints = 0;
        const query = 'INSERT INTO MEMBER (UserID, Password, Name, RewardPoints, Email, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [UserID, hashedPassword, Name, RewardPoints, Email, Phone, Address], (err, result) => {
            if (err) return callback(err);
            callback(null, { message: 'User registered successfully' });
        });
    });
};

const loginUser = (userData, callback) => {
    const { UserID, Password } = userData;
    const query = 'SELECT * FROM MEMBER WHERE UserID = ?';
    connection.query(query, [UserID], (err, results) => {
        if (err) return callback(err);

        if (results.length === 0) {
            return callback(null, { message: 'Wrong UserID, please check again', status: 401 });
        }

        const user = results[0];
        bcrypt.compare(Password, user.Password, (err, isMatch) => {
            if (err) return callback(err);

            if (!isMatch) {
                return callback(null, { message: 'Wrong Password, check again please', status: 401 });
            }

            const token = jwt.sign({ userId: user.UserID }, 'your_jwt_secret', { expiresIn: '1h' });
            const { Password, ...userWithoutPassword } = user;

            callback(null, { message: 'Login successful', token, user: userWithoutPassword });
        });
    });
};

module.exports = {
    registerUser,
    loginUser
};
