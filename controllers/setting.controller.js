const controller = {
    showSettings: async (req, res) => {
        res.render('dashboard/settings/index', {
            title: 'Settings',
            layout: 'layouts/dashboard',
            path: '/dashboard/settings'
        });
    }
};

module.exports = controller;