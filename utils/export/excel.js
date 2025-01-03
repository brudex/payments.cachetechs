const ExcelJS = require('exceljs');

async function exportToExcel(res, transactions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
        { header: 'Transaction ID', key: 'transactionId', width: 20 },
        { header: 'Order ID', key: 'orderId', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Currency', key: 'currency', width: 10 },
        { header: 'Status', key: 'paymentStatus', width: 12 },
        { header: 'Payment Mode', key: 'paymentMode', width: 15 },
        { header: 'Description', key: 'orderDescription', width: 30 },
        { header: 'Date', key: 'createdAt', width: 20 }
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

module.exports = exportToExcel;