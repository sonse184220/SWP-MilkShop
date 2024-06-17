import express from 'express';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

router.post('/add', checkAuthenticated, cartController.addToCart);
router.post('/remove', checkAuthenticated, cartController.removeFromCart);
router.post('/update', checkAuthenticated, cartController.updateCart);
router.get('/view', checkAuthenticated, cartController.viewCart);

export default router;
