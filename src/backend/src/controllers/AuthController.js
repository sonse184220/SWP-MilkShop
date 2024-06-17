import { AuthService } from "../services/authService.js";

export class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    registerUser = (req, res) => {
        this.authService.registerUser(req.body, req, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 201).json(result);
        });
    };

    loginUser = (req, res) => {
        this.authService.loginUser(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    verifyEmail = (req, res) => {
        this.authService.verifyEmail(req.query.token, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(result.status || 200).json(result);
        });
    };

    completeProfile = (req, res) => {
        this.authService.completeProfile(req, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    };
}