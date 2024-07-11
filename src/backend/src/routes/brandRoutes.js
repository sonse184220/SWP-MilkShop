import { BrandController } from "../controllers/BrandController.js"

import express from 'express';
import { checkAuthenticated } from "../middlewares/authMiddleware.js";
import { isStaff } from "../middlewares/validationMiddleware.js";
import { checkBrandData, checkBrandId } from "../middlewares/brandValidators.js";

const router = express.Router();
const brandController = new BrandController();

router.get('/', brandController.getAllBrands);

router.get("/:brandId", checkBrandId, async (req, res) => {
    await brandController.getBrandById(req, res);
})

router.post("/staff/create", checkAuthenticated, isStaff, checkBrandData, async (req, res) => {
    await brandController.createBrand(req, res);
})

router.delete("/staff/:brandId/delete", checkAuthenticated, isStaff, checkBrandId, async (req, res) => {
    await brandController.deleteBrand(req, res);
})

export { router as brandRoutes };