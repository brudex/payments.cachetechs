const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const appController = require('../controllers/app.controller');
const apiAppController = require('../controllers/api/app.controller');
const transactionController = require('../controllers/transaction.controller');
const settingController = require('../controllers/setting.controller');

// Dashboard home
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard/index', {
        title: 'Dashboard',
        layout: 'layouts/dashboard',
        path: '/dashboard'
    });
});

// Apps routes
router.get('/apps', isAuthenticated, appController.listApps);
router.get('/apps/create', isAuthenticated, appController.createAppView);
router.post('/apps/create', isAuthenticated, appController.createApp);
router.get('/apps/validate-name', isAuthenticated, appController.validateAppName);
router.get('/apps/:appId/test', isAuthenticated, appController.testApi);
router.get('/apps/:appId/edit', isAuthenticated, appController.editAppView);
router.post('/apps/:appId/update', isAuthenticated, appController.updateApp);
// App credentials API
router.get('/apps/:appId/credentials', isAuthenticated, apiAppController.getCredentials);
router.post('/apps/:appId/regenerate-credentials', isAuthenticated, apiAppController.regenerateCredentials);

// Transactions routes
router.get('/transactions', isAuthenticated, transactionController.listTransactions);

// Settings routes
router.get('/settings', isAuthenticated, settingController.showSettings);


module.exports = router;