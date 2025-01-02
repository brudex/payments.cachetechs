const controller = {
    listTransactions: async (req, res) => {
        res.render('dashboard/transactions/list', {
            title: 'Transactions',
            layout: 'layouts/dashboard',
            path: '/dashboard/transactions'
        });
    }
};

module.exports = controller;