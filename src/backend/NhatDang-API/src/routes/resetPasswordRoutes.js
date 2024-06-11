const express = require('express');
const brandService = require('../services/brandService');
require('dotenv').config();

const router = express.Router();

router.get('/', brandService.getAllBrands);

module.exports = router;
