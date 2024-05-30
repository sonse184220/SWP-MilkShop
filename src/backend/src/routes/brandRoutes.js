import { BrandController } from "../controllers/BrandController.js"

const express = require('express');

const router = express.Router();
const brandController = new BrandController();

router.get('/', brandController.getAllBrands);

module.exports = router;
