import express from 'express';
import { getAllProducts, getProductById } from '../services/productService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
