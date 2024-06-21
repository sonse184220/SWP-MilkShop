import express from 'express';
import { OrderController } from '../controllers/orderController.js';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();
const orderController = new OrderController();

router.post('/place-order', checkAuthenticated, orderController.placeOrder);

export { router as orderRoutes };
