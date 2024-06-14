import express from 'express';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { addToCart, removeFromCart, updateCart, viewCart } from '../services/cartService.js';

const router = express.Router();

router.post('/add', checkAuthenticated, addToCart);
router.post('/remove', checkAuthenticated, removeFromCart);
router.post('/update', checkAuthenticated, updateCart);
router.get('/view', checkAuthenticated, viewCart);

export default router;
