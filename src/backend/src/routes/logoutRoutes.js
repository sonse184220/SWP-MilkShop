import express from 'express';
import { LogoutController } from '../controllers/logoutController.js';

const router = express.Router();
const logoutController = new LogoutController();

router.post('/', (req, res) => logoutController.logout(req, res));

export { router as logoutRoutes };
