import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();

export class AuthController {
    registerUser = (req, res) => {
        authService.registerUser(req.body, req, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 201).json(result);
        });
    };

    loginUser = (req, res) => {
        authService.loginUser(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    verifyEmail = (req, res) => {
        authService.verifyEmail(req.query.token, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.status === 200) {
                res.redirect('http://localhost:3000/login-register');
            } else {
                res.status(result.status).json(result);
            }
        });
    };

    registerAdmin = (req, res) => {
        authService.registerAdmin(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 201).json(result);
        });
    };

    createStaff = (req, res) => {
        authService.createStaff(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 201).json(result);
        });
    };
}
