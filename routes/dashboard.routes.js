const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const appController = require('../controllers/app.controller');
const transactionController = require('../controllers/transaction.controller');
const settingController = require('../controllers/setting.controller');

// Dashboard home
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard/index', {
        title: 'Dashboard Overview',
        layout: 'layouts/dashboard',
        path: '/dashboard'
    });
});

// App routes
router.get('/apps', isAuthenticated, appController.listApps);
router.get('/apps/create', isAuthenticated, appController.showCreateForm);
router.post('/apps/create', isAuthenticated, appController.createApp);

// Transaction routes
router.get('/transactions', isAuthenticated, transactionController.listTransactions);

// Settings routes
router.get('/settings', isAuthenticated, settingController.showSettings);

module.exports = router;