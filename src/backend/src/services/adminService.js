import { connection } from '../utils/dbConnection.js';

export class AdminService {
    disableAccount = (userId, callback) => {
        const checkAdminQuery = 'Select isAdmin from user where UserID = ?';
        connection.query(checkAdminQuery, [userId], (err, results) => {
            if (err) return callback(err);

            if (results.length === 0) {
                return callback(new Error('User not found'));
            }

            if (results[0].isAdmin) {
                return callback(new Error('Cannot disable another admin account.'));
            }

            const query = 'UPDATE user SET activeStatus = "inactive" WHERE UserID = ?';
            connection.query(query, [userId], (err, result) => {
                if (err) return callback(err);
                callback(null, { message: 'Account disabled successfully', status: 200 });
            });
        });
    };

    enableAccount = (userId, callback) => {
        const query = 'Update user SET activeStatus = "active" where UserID = ?';
        connection.query(query, [userId], (err, result) => {
            if (err) return callback(err);
            callback(null, { message: 'Account enabled successfully', status: 200 });
        });
    };


    getTotalRevenue = (callback) => {
        const query = `
            Select 
                SUM(TotalPrice) as totalRevenue
            from \`order\` 
            Where Status = 'Done'  and MONTH(created) = MONTH(CURRENT_DATE()) 
            and YEAR(created) = YEAR(CURRENT_DATE())
        `;

        connection.query(query, (err, results) => {
            if (err) return callback(err);

            const totalRevenue = results[0].totalRevenue || 0;

            const orderQuery = `
                SELECT OrderID, TotalPrice, Status, created, updated 
                FROM \`order\` 
                WHERE Status = 'Done' 
                    AND MONTH(created) = MONTH(CURRENT_DATE()) 
                    AND YEAR(created) = YEAR(CURRENT_DATE())
            `;

            connection.query(orderQuery, (err, orders) => {
                if (err) return callback(err);
                callback(null, { totalRevenue, orders, status: 200 });
            });
        });
    };
}
