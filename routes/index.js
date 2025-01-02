const express = require("express");
const router = express.Router();
const pageRoutes = require('./page.routes');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');

// Mount sub-routers
router.use('/', pageRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

// 404 handler - should be last
router.get("*", (req, res) => {
    res.render("404", { layout: false });
});

module.exports = router;