import express from 'express';
import { getAllBrands } from '../controllers/brandController.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', getAllBrands);

export default router;
