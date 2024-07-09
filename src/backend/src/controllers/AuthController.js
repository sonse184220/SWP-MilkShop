import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export class AuthController {
    registerUser = async (req, res) => {
        try {
            const result = await authService.registerUser(req.body, req);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    loginUser = async (req, res) => {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    verifyEmail = async (req, res) => {
        try {
            const result = await authService.verifyEmail(req.query.token);
            if (result.status === 200) {
                res.redirect('http://localhost:3000/login-register');
            } else {
                res.status(result.status).json(result);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    registerAdmin = async (req, res) => {
        try {
            const result = await authService.registerAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    createStaff = async (req, res) => {
        try {
            const result = await authService.createStaff(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
