const connection = require('../utils/db');

const getUserInfo = (userId, callback) => {
    const query = 'SELECT UserID, Name, Email, Phone, Address, RewardPoints, Verified FROM MEMBER WHERE UserID = ?';
    connection.query(query, [userId], callback);
};

const updateUserInfo = (userId, newUserData, callback) => {
    getUserInfo(userId, (err, results) => {
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

        if (fieldsToUpdate.length === 0) {
            return callback(null, { message: 'No fields to update', status: 400 });
        }

        const query = `UPDATE MEMBER SET ${fieldsToUpdate.join(', ')} WHERE UserID = ?`;
        values.push(userId);

        connection.query(query, values, (err, result) => {
            if (err) return callback(err);


            getUserInfo(userId, (err, updatedResults) => {
                if (err) return callback(err);
                callback(null, { message: 'User updated successfully', user: updatedResults[0] });
            });
        });
    });
};

const completeProfile = (req, callback) => {
    const { userId, name, phone, address } = req.body;
    const query = 'UPDATE MEMBER SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?';
    connection.query(query, [name, phone, address, userId], (err, result) => {
        if (err) return callback(err);


        getUserInfo(userId, (err, updatedResults) => {
            if (err) return callback(err);
            callback(null, { message: 'Profile completed successfully', user: updatedResults[0] });
        });
    });
};

module.exports = {
    getUserInfo,
    updateUserInfo,
    completeProfile
};
