import { poolConnect } from "../utils/dbConnection.js";

export class UserReportService {
    async getAllUserReports(limit, sortBy, offset, statusQuery, statusValue) {
        const [reports] = await poolConnect.query(`SELECT u.Name as userName, s.Name as staffName, ur.*
                                                   FROM user_report AS ur
                                                   JOIN user AS u ON u.UserID = ur.UserID
                                                   LEFT JOIN user AS s ON s.UserID = ur.StaffID
                                                   ${statusQuery} ORDER BY ${sortBy} LIMIT ? OFFSET ?`
                                                ,[...statusValue, limit, offset]);
        return reports;
    }
    async getTotalAllUserReports(statusQuery, statusValue) {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM user_report ${statusQuery}`, statusValue);
        const count = total[0].count;
        return count;
    }

    async getUserReports(userId, limit, sortBy, offset, statusQuery, statusValue) {
        const [reports] = await poolConnect.query(`SELECT u.Name as userName, s.Name as staffName, ur.*
                                                   FROM user_report AS ur
                                                   JOIN user AS u ON u.UserID = ur.UserID
                                                   LEFT JOIN user AS s ON s.UserID = ur.StaffID
                                                   WHERE ur.UserID = ? ${statusQuery} ORDER BY ${sortBy} LIMIT ? OFFSET ?`
                                                ,[userId, ...statusValue, limit, offset]);
        return reports;
    }
    async getTotalUserReports(userId, statusQuery, statusValue) {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM user_report WHERE UserID = ? ${statusQuery}`, [userId, ...statusValue]);
        const count = total[0].count;
        return count;
    }

    async getReportById(reportId) {
        const [report] = await poolConnect.query(`SELECT u.Name as userName, s.Name as staffName, ur.*
                                                   FROM user_report AS ur
                                                   JOIN user AS u ON u.UserID = ur.UserID
                                                   LEFT JOIN user AS s ON s.UserID = ur.StaffID
                                                   WHERE ReportID = ?`, [reportId]);
        return report;
    }

    async createReport(userId, orderType, title, content, createQuery, createQueryValue, createValue) {
        const [report] = await poolConnect.query(`INSERT INTO user_report (OrderType, ${createQuery} UserID, Title, Content)
                                                  VALUES (?,${createQueryValue}?,?,?)`, [orderType, ...createValue, userId, title, content])
        return report;
    }

    async updateReport(reportId, staffId, response) {
        const [report] = await poolConnect.query(`UPDATE user_report SET StaffID = ?, Response = ?, Status = 'closed' WHERE ReportID = ?`, [staffId, response, reportId])
        return report;
    }

    async deleteReport(reportId) {
        const [result] = await poolConnect.query(`DELETE FROM user_report WHERE ReportID = ?`, [reportId])
        return result;
    }
}