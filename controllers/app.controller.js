const db = require('../models');
const { generateSecureId, generateApiKey } = require('../utils/security');
const { validateAppInput } = require('../utils/validation');

const controller = {
    // Show app creation form
    showCreateForm: async (req, res) => {
        const paymentModeOptions = ['card', 'wallet', 'crypto'];
        res.render('dashboard/apps/create', {
            title: 'Create New App',
            layout: 'layouts/dashboard',
            path: '/dashboard/apps',
            paymentModeOptions
        });
    },

    // Create new app
    createApp: async (req, res) => {
        try {
            const { error } = validateAppInput(req.body);
            if (error) {
                req.flash('error', error.message);
                return res.redirect('/dashboard/apps/create');
            }

            const appData = {
                uuid: generateSecureId(),
                userUuid: req.session.user.uuid,
                appName: req.body.appName,
                logoUrl: req.body.logoUrl,
                paymentModes: req.body.paymentModes || ['card'],
                appId: generateSecureId(),
                apiKey: generateApiKey(),
                appSecret: generateSecureId(),
                shouldSendClientCallback: req.body.shouldSendClientCallback === 'true',
                appCallbackUrl: req.body.appCallbackUrl,
                isActive: true
            };

            await db.UserApp.create(appData);
            req.flash('success', 'Application created successfully');
            res.redirect('/dashboard/apps');
        } catch (error) {
            console.error('Error creating app:', error);
            req.flash('error', 'Failed to create application');
            res.redirect('/dashboard/apps/create');
        }
    },

    // List all apps
    listApps: async (req, res) => {
        try {
            const apps = await db.UserApp.findAll({
                where: { userUuid: req.session.user.uuid },
                order: [['createdAt', 'DESC']]
            });

            res.render('dashboard/apps/list', {
                title: 'My Applications',
                layout: 'layouts/dashboard',
                path: '/dashboard/apps',
                apps
            });
        } catch (error) {
            console.error('Error fetching apps:', error);
            req.flash('error', 'Failed to fetch applications');
            res.redirect('/dashboard');
        }
    }
};

module.exports = controller;