const express = require("express");
const router = express.Router();
const pageRoutes = require('./page.routes');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const apiRoutes = require('./api');

router.use('/', pageRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

router.get("*", (req, res) => {
    res.render("404", { layout: false });
});

module.exports = router;