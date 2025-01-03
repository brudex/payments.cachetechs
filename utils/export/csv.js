const { Parser } = require('json2csv');

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

module.exports = exportToCsv;