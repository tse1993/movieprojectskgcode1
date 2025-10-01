const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

module.exports = router;
