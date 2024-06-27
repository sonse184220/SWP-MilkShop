import { UserService } from '../services/userService.js';

const userService = new UserService();

export class UserController {
    getUserInfo = (req, res) => {
        const userId = req.params.userId;
        userService.getUserInfo(userId, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(results[0]);
        });
    };

    updateUserInfo = (req, res) => {
        const userId = req.params.userId;
        const newUserData = req.body;
        userService.updateUserInfo(userId, newUserData, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };

    changePassword = (req, res) => {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        userService.changePassword(userId, oldPassword, newPassword, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };
}
