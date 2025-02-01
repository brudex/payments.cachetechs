const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares/auth.middleware");
const transactionController = require("../controllers/transaction.controller");


router.get('/transactions', isAuthenticated, transactionController.getTransactions);
// Single transaction details
router.get('/transactions/:id', isAuthenticated, transactionController.getTransactionDetails);
// Export transactions
router.get('/transactions/export/:format', isAuthenticated, transactionController.exportTransactions);
module.exports = router;
