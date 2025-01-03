const PDFDocument = require('pdfkit');

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

module.exports = exportToPdf;