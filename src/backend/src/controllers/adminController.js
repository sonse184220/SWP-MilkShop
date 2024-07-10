import { AdminService } from '../services/adminService.js';

const adminService = new AdminService();

export class AdminController {
    disableAccount = async (req, res) => {
        try {
            const { userId } = req.body;
            const result = await adminService.disableAccount(userId);
            res.status(result.status || 200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    enableAccount = async (req, res) => {
        try {
            const { userId } = req.body;
            const result = await adminService.enableAccount(userId);
            res.status(result.status || 200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getTotalRevenue = async (req, res) => {
        try {
            const result = await adminService.getTotalRevenue();
            res.status(result.status || 200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    getAllAccounts = async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const accounts = await adminService.getAllAccounts(page, limit);
            const totalAccounts = await adminService.getTotalAccounts();
            const totalPages = Math.ceil(totalAccounts / limit);

            res.status(200).json({
                accounts,
                totalAccounts,
                totalPages,
                currentPage: page
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    getMonthlyRevenue = async (req, res) => {
        try {
            const result = await adminService.getMonthlyRevenue();
            res.status(result.status || 200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    getWeeklyRevenue = async (req, res) => {
        try {
            const result = await adminService.getWeeklyRevenue();
            res.status(result.status || 200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}