import { poolConnect } from '../utils/dbConnection.js';

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
            FROM (
                SELECT TotalPrice, created FROM \`order\` WHERE Status = 'Done'
                UNION ALL
                SELECT TotalPrice, created FROM \`pre_order\` WHERE Status = 'Done'
            ) AS combined_orders
            WHERE MONTH(created) = MONTH(CURRENT_DATE())
            AND YEAR(created) = YEAR(CURRENT_DATE())
        `;

        const [results] = await poolConnect.query(query);
        const totalRevenue = results[0].totalRevenue || 0;

        const orderQuery = `
            Select OrderID, TotalPrice, Status, created, updated 
            FROM (
                SELECT OrderID, TotalPrice, Status, created, updated FROM \`order\` WHERE Status = 'Done'
                UNION ALL
                SELECT PreorderID AS OrderID, TotalPrice, Status, created, updated FROM \`pre_order\` WHERE Status = 'Done'
            ) AS combined_orders
            WHERE MONTH(created) = MONTH(CURRENT_DATE()) 
            AND YEAR(created) = YEAR(CURRENT_DATE())
        `;

        const [orders] = await poolConnect.query(orderQuery);
        return { totalRevenue, orders, status: 200 };
    }

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

    async getMonthlyRevenue() {
        const query = `
            Select 
                MONTH(created) AS month, 
                SUM(TotalPrice) AS totalRevenue 
            From (
                SELECT TotalPrice, created FROM \`order\` WHERE Status = 'Done'
                UNION ALL
                SELECT TotalPrice, created FROM \`pre_order\` WHERE Status = 'Done'
            ) AS combined_orders
            WHERE YEAR(created) = YEAR(CURRENT_DATE())
            GROUP BY MONTH(created)
        `;

        const [results] = await poolConnect.query(query);
        const monthlyRevenue = results.map(result => ({
            month: new Date(0, result.month - 1).toLocaleString('default', { month: 'long' }),
            totalRevenue: result.totalRevenue || 0
        }));

        return { monthlyRevenue, status: 200 };
    }
    async getWeeklyRevenue() {
        const query = `
            Select 
                WEEK(created, 1) AS week, 
                SUM(TotalPrice) AS totalRevenue 
            from (
                SELECT TotalPrice, created FROM \`order\` WHERE Status = 'Done'
                UNION ALL
                SELECT TotalPrice, created FROM \`pre_order\` WHERE Status = 'Done'
            ) as combined_orders
            WHERE MONTH(created) = MONTH(CURRENT_DATE())
            AND YEAR(created) = YEAR(CURRENT_DATE())
            GROUP BY WEEK(created, 1)
        `;

        const [results] = await poolConnect.query(query);
        const month = new Date().toLocaleString('default', { month: 'long' });

        const weeks = results.map((result, index) => ({
            Week: index + 1,
            totalRevenue: result.totalRevenue || 0
        }));

        return { Month: month, Weeks: weeks, status: 200 };
    }
    async getTopUsers() {
        const query = `
            SELECT 
                u.UserID, 
                u.Name, 
                COUNT(o.OrderID) AS orderCount 
            FROM 
                \`order\` o
            JOIN 
                \`user\` u ON o.UserID = u.UserID
            WHERE 
                u.isAdmin = 0 
                AND u.isStaff = 0 
                AND u.UserID IS NOT NULL
                AND MONTH(o.created) = MONTH(CURRENT_DATE()) 
                AND YEAR(o.created) = YEAR(CURRENT_DATE())
            GROUP BY 
                u.UserID, u.Name
            ORDER BY 
                orderCount DESC
            LIMIT 5;
        `;

        const [results] = await poolConnect.query(query);
        return { topUsers: results, status: 200 };
    }

}
