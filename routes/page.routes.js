const express = require('express');
const router = express.Router();

// Public page routes
router.get("/", (req, res) => {
    res.render("index", {
        title: "Home",
        layout: 'layouts/default'
    });
});

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        layout: 'layouts/default',
        messages: req.flash()
    });
});

router.get("/register", (req, res) => {
    res.render("register", {
        title: "Register",
        layout: 'layouts/default',
        messages: req.flash()
    });
});

module.exports = router;