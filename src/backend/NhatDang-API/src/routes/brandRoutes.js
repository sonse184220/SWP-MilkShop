import express from 'express';
import { getAllBrands } from '../services/brandService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', getAllBrands);

export default router;
