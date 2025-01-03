const db = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');
const { exportToExcel, exportToCsv, exportToPdf } = require('../../utils/export');

const controller = {
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

            const total = await db.PaymentTransaction.count({ where });
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

module.exports = controller;