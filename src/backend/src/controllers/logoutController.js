import { LogoutService } from '../services/logoutService.js';

const logoutService = new LogoutService();

export class LogoutController {
    async logout(req, res) {
        const bearerHeader = req.headers['authorization'];

        if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
            return res.status(400).json({ error: 'Bearer token is missing or invalid' });
        }

        const token = bearerHeader.split(' ')[1];

        try {
            const response = await logoutService.logoutUser(token);
            res.json(response);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
