import { poolConnect, connection } from '../utils/dbConnection.js';

export class AdminService {
    async disableAccount(userId) {
        const checkAdmin = 'select isAdmin from user where userid = ?';
        const [results] = await poolConnect.query(checkAdmin, [userId]);
        if (results.length === 0) {
            throw new Error('User not found');
        } if (results[0].isAdmin) {
            throw new Error('Cannot disable another admin account');
        }
        const SetStatus = 'Update user set activeStatus = "inactive" where userID = ?';
        await poolConnect.query(SetStatus, [userId]);
        return { message: 'Account disabled successfully', status: 200 };
    }



    async enableAccount(userId) {
        const query = 'Update user set activeStatus ="active" where UserID = ?';
        await poolConnect.query(query, [userId]);
        return { message: 'Account enabled successfully', status: 200 };
    }
    async getTotalRevenue() {
        const query = `
            select 
                SUM(TotalPrice) as totalRevenue
            from \`order\` 
            WHERE Status = 'Done' AND MONTH(created) = MONTH(CURRENT_DATE()) 
            AND YEAR(created) = YEAR(CURRENT_DATE())
        `;

        const [results] = await poolConnect.query(query);
        const totalRevenue = results[0].totalRevenue || 0;
        const orderQuery = `Select OrderID, TotalPrice, Status, created, updated from \`order\` 
        where status = "Done" and month(created) = month(CURRENT_DATE()) 
        and year(created) = year(current_date())`;
        const [orders] = await poolConnect.query(orderQuery);
        return { totalRevenue, orders, status: 200 }
    };

    async getAllAccounts(page, limit) {
        const offset = (page - 1) * limit;
        const query = `select UserID, Name, Address, Email, Phone, isAdmin,
         isStaff, activeStatus from \`user\` limit ? offset ? `;
        const [results] = await poolConnect.query(query, [limit, offset]);
        const countQuery = 'select count(*) as total from `user`';
        const [countResults] = await poolConnect.query(countQuery);
        const total = countResults[0].total;
        return { accounts: results, total }
    }
    async getTotalAccounts() {
        const query = `Select count(*) as count from user`;
        const [total] = await poolConnect.query(query);
        const count = total[0].count;
        return count;
    }
}
