const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Authentication routes
router.post('/login', authController.loginPost);
router.post('/register', authController.createUser);
router.get('/logout', authController.logout);

module.exports = router;