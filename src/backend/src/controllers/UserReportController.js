import { OrderService } from "../services/orderService.js";
import { PreorderService } from "../services/PreorderService.js";
import { UserReportService } from "../services/UserReportService.js";

const userReportService = new UserReportService();
const orderService = new OrderService();
const preorderService = new PreorderService();

export class UserReportController {
    async getAllUserReports(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const { sort, status } = req.query;
            const offset = (page - 1) * limit;
    
            let statusQuery = "";
            let statusValue = [];
            switch (status) {
                case "open":
                    statusQuery = "WHERE Status = ?";
                    statusValue = [status];
                    break;
                case "closed":
                    statusQuery = "WHERE Status = ?";
                    statusValue = [status];
                    break;
                default:
                    // do nothing
            }
    
            let sortBy;
            switch (sort) {
                case "newest":
                    sortBy = "updated DESC";
                    break;
                case "oldest":
                    sortBy = "updated ASC";
                    break;
                case "recent":
                    sortBy = "created DESC";
                    break;
                case "past":
                    sortBy = "created DESC";
                    break;
                default:
                    sortBy = "updated DESC";
            }
    
            const reports = await userReportService.getAllUserReports(limit, sortBy, offset, statusQuery, statusValue);
            const total = await userReportService.getTotalAllUserReports(statusQuery, statusValue);
    
            res.status(200).send({
                total: total,
                page: page,
                totalPages: Math.ceil(total / limit),
                data: reports,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async getUserReports(req, res) {
        try {
            const userId = req.user.userId;
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const { sort, status } = req.query;
            const offset = (page - 1) * limit;
            
            if (userId !== req.params.userId && !req.user.isStaff && !req.user.isAdmin) {
                return res.status(403).send({ msg: "Forbidden." })
            }
    
            let statusQuery = "";
            let statusValue = [];
            switch (status) {
                case "open":
                    statusQuery = "AND Status = ?";
                    statusValue = [status];
                    break;
                case "closed":
                    statusQuery = "AND Status = ?";
                    statusValue = [status];
                    break;
                default:
                    // do nothing
            }
    
            let sortBy;
            switch (sort) {
                case "newest":
                    sortBy = "updated DESC";
                    break;
                case "oldest":
                    sortBy = "updated ASC";
                    break;
                case "recent":
                    sortBy = "created DESC";
                    break;
                case "past":
                    sortBy = "created DESC";
                    break;
                default:
                    sortBy = "updated DESC";
            }
    
            const reports = await userReportService.getUserReports(userId, limit, sortBy, offset, statusQuery, statusValue);
            const total = await userReportService.getTotalUserReports(userId, statusQuery, statusValue);
    
            res.status(200).send({
                total: total,
                page: page,
                totalPages: Math.ceil(total / limit),
                data: reports,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getReport(req, res) {
        try {
            const reportId = req.params.reportId;
    
            const report = await userReportService.getReportById(reportId);
            if (report.length === 0) {
                return res.status(404).send({ error: "Report not found!" })
            }
            if (report[0].UserID !== req.user.userId && !req.user.isStaff && !req.user.isAdmin) {
                return res.status(403).send({ msg: "Forbidden." })
            }
    
            return res.status(200).send(report);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createReport(req, res) {
        try {
            const { orderType, orderId, preorderId, title, content } = req.body;
            const userId = req.user.userId;
            const currentDate = new Date();
    
            let typeQuery = "";
            let typeQueryValue = "";
            let typeValue = [];
            switch (orderType) {
                case "order":
                    const checkOrder = await orderService.getOrder(orderId);
                    if (checkOrder.length === 0) { return res.status(404).send({ error: "Order not found!" })  }
                    if (checkOrder[0].UserID !== userId) { return res.status(403).send({ msg: "Forbidden." })  }

                    if (checkOrder[0].Status !== "Done") { return res.status(403).send({ msg: "This order hasnt been completed." }) }
                    const orderDateDifference = (currentDate - checkOrder[0].updated) / (1000 * 60 * 60 * 24); // 1000ms, 60s, 60m, 24h
                    if (orderDateDifference > 3){ return res.status(403).send({ msg: "The allowed reporting period for this order has expired (3 days since completed)." }) }

                    typeQuery = "OrderID,";
                    typeQueryValue = "?,";
                    typeValue = [orderId];
                    break;
                case "preorder":
                    const checkPreorder = await preorderService.getPreorder(preorderId);
                    if (checkPreorder.length === 0) { return res.status(404).send({ error: "Pre-order not found!" })  }
                    if (checkPreorder[0].UserID !== userId) { return res.status(403).send({ msg: "Forbidden." })  }

                    if (checkPreorder[0].Status !== "Done") { return res.status(403).send({ msg: "This pre-order hasnt been completed." }) }
                    const preorderDateDifference = (currentDate - checkOrder[0].updated) / (1000 * 60 * 60 * 24); // 1000ms, 60s, 60m, 24h
                    if (preorderDateDifference > 3){ return res.status(403).send({ msg: "The allowed reporting period for this pre-order has expired (3 days since completed)." }) }

                    typeQuery = "PreorderID,";
                    typeQueryValue = "?,";
                    typeValue = [preorderId];
                    break;
                default:
                    // do nothing
            }
    
            const creatingReport = await userReportService.createReport(userId, orderType, title, content, typeQuery, typeQueryValue, typeValue);
            if (creatingReport.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to create user report!" })
            }
            const createdReport = await userReportService.getReportById(creatingReport.insertId);
    
            return res.status(201).send(createdReport);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateReport(req, res) {
        try {
            const staffId = req.user.userId;
            const reportId = req.params.reportId;
            const { status, response } = req.body;
    
            const checkReport = await userReportService.getReportById(reportId);
            if (checkReport.length === 0) {
                return res.status(404).send({ error: "Report not found!" })
            }
    
            let queryField = [];
            let valueField = [];
            if (status && status !== checkReport[0].Status) {
                queryField.push("Status = ?")
                valueField.push(status);
            }
            if (response && response !== checkReport[0].Response) {
                queryField.push("Response = ?")
                valueField.push(response);
            }
            if (queryField.length === 0) {
                return res.status(200).send(checkReport);
            }
    
            const updatingReport = await userReportService.updateReport(reportId, staffId, queryField, valueField);
            if (updatingReport.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update report!" })
            }
    
            const updatedReport = await userReportService.getReportById(reportId);
            return res.status(200).send(updatedReport);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteReport(req, res) {
        try {
            const reportId = req.params.reportId;
    
            const checkReport = await userReportService.getReportById(reportId);
            if (checkReport.length === 0) {
                return res.status(404).send({ error: "Report not found!" })
            }
    
            const deletingReport = await userReportService.deleteReport(reportId);
            if (deletingReport.affectedRows === 0) {
                return res.status(500).send({ error: "Cant delete report!" })
            }
            return res.status(200).send({ msg: `Successfully deleted report ${reportId}!` })
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}