const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

const controller = {
    // Render transaction list page
    listTransactions: async (req, res) => {
        res.render('dashboard/transactions/list', {
            title: 'Transactions',
            layout: 'layouts/dashboard',
            path: '/dashboard/transactions'
        });
    },

    // API endpoint to fetch transactions with filters
    getTransactions: async (req, res) => {
        try {
            const {
                startDate,
                endDate,
                status,
                paymentMode,
                currency,
                start = 0,
                length = 10,
                search = {}
            } = req.query;

            // Build where clause
            const where = { userUuid: req.session.user.uuid };
            
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }
            
            if (status) where.paymentStatus = status;
            if (paymentMode) where.paymentMode = paymentMode;
            if (currency) where.currency = currency;
            
            if (search.value) {
                where[Op.or] = [
                    { transactionId: { [Op.iLike]: `%${search.value}%` } },
                    { orderId: { [Op.iLike]: `%${search.value}%` } },
                    { orderDescription: { [Op.iLike]: `%${search.value}%` } }
                ];
            }

            // Get total count
            const total = await db.PaymentTransaction.count({ where });

            // Get filtered data
            const transactions = await db.PaymentTransaction.findAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: length,
                offset: start
            });

            res.json({
                draw: parseInt(req.query.draw, 10),
                recordsTotal: total,
                recordsFiltered: total,
                data: transactions
            });
        } catch (error) {
            logger.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    },

    // Get single transaction details
    getTransactionDetails: async (req, res) => {
        try {
            const transaction = await db.PaymentTransaction.findOne({
                where: {
                    transactionId: req.params.id,
                    userUuid: req.session.user.uuid
                }
            });

            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            res.json(transaction);
        } catch (error) {
            logger.error('Error fetching transaction details:', error);
            res.status(500).json({ error: 'Failed to fetch transaction details' });
        }
    },

    // Export transactions
    exportTransactions: async (req, res) => {
        try {
            const { format } = req.params;
            const transactions = await db.PaymentTransaction.findAll({
                where: { userUuid: req.session.user.uuid },
                order: [['createdAt', 'DESC']]
            });

            switch (format.toLowerCase()) {
                case 'excel':
                    await exportToExcel(res, transactions);
                    break;
                case 'csv':
                    await exportToCsv(res, transactions);
                    break;
                case 'pdf':
                    await exportToPdf(res, transactions);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid export format' });
            }
        } catch (error) {
            logger.error('Export error:', error);
            res.status(500).json({ error: 'Export failed' });
        }
    }
};

// Export helper functions
async function exportToExcel(res, transactions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
        { header: 'Transaction ID', key: 'transactionId' },
        { header: 'Order ID', key: 'orderId' },
        { header: 'Amount', key: 'amount' },
        { header: 'Currency', key: 'currency' },
        { header: 'Status', key: 'paymentStatus' },
        { header: 'Payment Mode', key: 'paymentMode' },
        { header: 'Description', key: 'orderDescription' },
        { header: 'Date', key: 'createdAt' }
    ];

    transactions.forEach(transaction => {
        worksheet.addRow({
            ...transaction.toJSON(),
            createdAt: new Date(transaction.createdAt).toLocaleString()
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');

    await workbook.xlsx.write(res);
}

async function exportToCsv(res, transactions) {
    const fields = ['transactionId', 'orderId', 'amount', 'currency', 'paymentStatus', 
                   'paymentMode', 'orderDescription', 'createdAt'];
    const parser = new Parser({ fields });
    
    const csv = parser.parse(transactions.map(t => ({
        ...t.toJSON(),
        createdAt: new Date(t.createdAt).toLocaleString()
    })));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
}

async function exportToPdf(res, transactions) {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(16).text('Transaction Report', { align: 'center' });
    doc.moveDown();

    transactions.forEach((transaction, index) => {
        if (index > 0) doc.moveDown();
        
        doc.fontSize(12).text(`Transaction ID: ${transaction.transactionId}`);
        doc.fontSize(10)
           .text(`Order ID: ${transaction.orderId}`)
           .text(`Amount: ${transaction.currency} ${transaction.amount}`)
           .text(`Status: ${transaction.paymentStatus}`)
           .text(`Date: ${new Date(transaction.createdAt).toLocaleString()}`);
    });

    doc.end();
}

module.exports = controller;