const express = require("express");
const router = express.Router();

// Public Routes
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login", { messages: req.flash() });
});

router.get("/register", (req, res) => {
    res.render("register", { messages: req.flash() });
});


// Dashboard Routes
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

// Authentication Routes
router.post("/auth/login", (req, res) => {
    res.redirect('/dashboard');
});

router.post("/auth/register", (req, res) => {
    res.redirect('/login');
});

router.get("/auth/logout", (req, res) => {
    res.redirect('/login');
});

// 404 handler - should be last
router.get("404", (req, res) => {
    res.render("404");
});

module.exports = router;