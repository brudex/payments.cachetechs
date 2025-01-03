const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/auth.middleware');
const transactionController = require('../../controllers/transaction.controller');

// Transaction list with filters
router.get('/', isAuthenticated, transactionController.getTransactions);

// Single transaction details
router.get('/:id', isAuthenticated, transactionController.getTransactionDetails);

// Export transactions
router.get('/export/:format', isAuthenticated, transactionController.exportTransactions);

module.exports = router;