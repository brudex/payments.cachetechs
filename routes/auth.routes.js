const express = require('express');
const router = express.Router();
const { loginPost, createUserPost, logout } = require('../controllers/auth.controller');

// Authentication routes
router.post("/login", loginPost);
router.post("/register", createUserPost);
router.get("/logout", logout);

module.exports = router;