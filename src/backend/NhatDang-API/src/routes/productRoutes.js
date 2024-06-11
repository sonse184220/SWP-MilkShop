const express = require('express');
const productService = require('../services/productService');
require('dotenv').config();

const router = express.Router();

router.get('/', productService.getAllProducts);
router.get('/:id', productService.getProductById);

module.exports = router;
