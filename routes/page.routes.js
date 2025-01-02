const express = require('express');
const router = express.Router();

// Public page routes
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login", { messages: req.flash() });
});

router.get("/register", (req, res) => {
    res.render("register", { messages: req.flash() });
});

// Dashboard route
router.get("/dashboard", (req, res) => {
    const mockUser = {
        fullName: 'Demo User'
    };
    
    res.render("dashboard/index", {
        user: mockUser,
        path: '/dashboard',
        layout: 'layouts/dashboard'
    });
});

module.exports = router;