import { UserService } from '../services/userService.js';

const userService = new UserService();

export class UserController {
    async getUserInfo(req, res) {
        try {
            const userId = req.params.userId;
            const userInfo = await userService.getUserInfo(userId);
            if (!userInfo) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(userInfo);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateUserInfo(req, res) {
        try {
            const userId = req.params.userId;
            const newUserData = {
                ...req.body,
                ProfilePicture: req.file ? req.file.buffer : null,
            };
            const result = await userService.updateUserInfo(userId, newUserData);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.userId;
            const { oldPassword, newPassword } = req.body;
            const result = await userService.changePassword(userId, oldPassword, newPassword);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
