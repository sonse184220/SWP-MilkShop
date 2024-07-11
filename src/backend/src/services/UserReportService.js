import { poolConnect } from "../utils/dbConnection.js";

export class UserReportService {
    async getAllUserReports(limit, sortBy, offset, statusQuery, statusValue) {
        const [reports] = await poolConnect.query(`SELECT u.Name as userName, s.Name as staffName, ur.*
                                                   FROM user_report AS ur
                                                   JOIN user AS u ON u.UserID = ur.UserID
                                                   JOIN user AS s ON s.UserID = ur.StaffID
                                                   ${statusQuery} ORDER BY ${sortBy} LIMIT ? OFFSET ?`
                                                ,[...statusValue, limit, offset]);
        return reports;
    }

    async getTotalUserReports(statusQuery, statusValue) {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM user_report ${statusQuery}`, statusValue);
        const count = total[0].count;
        return count;
    }

    async createReport(userId, orderType, title, content, createQuery, createQueryValue, createValue) {
        const [report] = await poolConnect.query(`INSERT INTO user_report (OrderType, ${createQuery} UserID, Title, Content)
                                                  VALUES (?,${createQueryValue}?,?,?)`, [orderType, ...createValue, userId, title, content])
        return report;
    }
}