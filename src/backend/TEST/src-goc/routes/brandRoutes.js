import { BrandController } from "../controllers/BrandController.js"

import express from 'express';

const router = express.Router();
const brandController = new BrandController();

router.get('/', brandController.getAllBrands);

export { router as brandRoutes };