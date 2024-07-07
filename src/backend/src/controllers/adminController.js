import { AdminService } from '../services/adminService.js';

const adminService = new AdminService();

export class AdminController {
    disableAccount = (req, res) => {
        const { userId } = req.body;
        adminService.disableAccount(userId, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    enableAccount = (req, res) => {
        const { userId } = req.body;
        adminService.enableAccount(userId, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    getTotalRevenue = (req, res) => {
        adminService.getTotalRevenue((err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };
}
