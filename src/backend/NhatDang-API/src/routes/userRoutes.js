const express = require('express');
const userService = require('../services/userService');
require('dotenv').config();

const router = express.Router();

router.get('/:userId', userService.getUserInfo);
router.put('/:userId', userService.updateUserInfo);
router.post('/complete-profile', userService.completeProfile);

module.exports = router;
