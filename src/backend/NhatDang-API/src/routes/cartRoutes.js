const express = require('express');
const { checkAuthenticated } = require('../middlewares/authMiddleware');
const cartService = require('../services/cartService');
require('dotenv').config();

const router = express.Router();

router.post('/add', checkAuthenticated, cartService.addToCart);
router.get('/view', checkAuthenticated, cartService.viewCart);

module.exports = router;
