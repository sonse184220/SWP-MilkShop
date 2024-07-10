import { UserReportService } from "../services/UserReportService.js";

const userReportService = new UserReportService();

export class UserReportController {
    async getAllUserReports(req, res) {
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
        const total = await userReportService.getTotalUserReports(statusQuery, statusValue);

        res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: reports,
        });
    }

    async createReport(req, res) {
        const { orderType, orderId, preorderId, title, content } = req.body;
        const userId = req.user.userId;

        // const creatingReport = await userReportService.
    }

}