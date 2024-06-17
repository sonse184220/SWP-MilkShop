import express from 'express';
import { registerUser, loginUser, verifyEmail, completeProfile } from '../controllers/authController.js';
import { checkRegister, checkLogin } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/register', checkRegister, async (req, res) => {
    try {
        const result = await registerUser(req.body, req);
        res.status(result.status || 201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', checkLogin, async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.status(result.status || 200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/verify-email', async (req, res) => {
    try {
        const result = await verifyEmail(req.query.token);
        res.status(result.status || 200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/complete-profile', async (req, res) => {
    try {
        const result = await completeProfile(req);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
