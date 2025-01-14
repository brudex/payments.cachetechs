const express = require('express');
const router = express.Router();
const transactionRoutes = require('./transaction.routes');

router.use('/transactions', transactionRoutes);

module.exports = router;
