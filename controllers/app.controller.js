const db = require('../models');
const logger = require('../utils/logger');
const { validateAppInput } = require('../utils/validation');
const { generateSecureId, generateApiKey } = require('../utils/security');
const { PAYMENT_MODE_LABELS, DEFAULT_PAYMENT_MODES } = require('../constants/payment');

const controller = {
    // Existing methods
    listApps: async (req, res) => {
        try {
            const apps = await db.UserApp.findAll({
                where: { userUuid: req.session.user.uuid }
            });
            
            res.render('dashboard/apps/list', {
                title: 'My Applications',
                layout: 'layouts/dashboard',
                path: '/dashboard/apps',
                apps
            });
        } catch (error) {
            logger.error('Error fetching apps', error);
            req.flash('error', 'Failed to load applications');
            res.redirect('/dashboard');
        }
    },

    // Show create app form
    createAppView: async (req, res) => {
        res.render('dashboard/apps/create', {
            title: 'Create Application',
            layout: 'layouts/dashboard',
            path: '/dashboard/apps',
            paymentModes: PAYMENT_MODE_LABELS,
            defaultModes: DEFAULT_PAYMENT_MODES
        });
    },

    // Create new app
    createApp: async (req, res) => {
        try {
            logger.info('Create app request received:', {
                body: req.body,
                user: req.session.user.uuid
            });

            const payload = {
                appName: req.body.appName,
                paymentModes: Array.isArray(req.body['paymentModes[]']) 
                    ? req.body['paymentModes[]'] 
                    : [req.body['paymentModes[]']],
                shouldSendCallback: req.body.shouldSendCallback === 'true',
                callbackUrl: req.body.callbackUrl
            };

            logger.info('Processed payload:', { payload });

            const { error } = validateAppInput(payload);
            if (error) {
                logger.error('Validation failed:', {
                    error: error.details[0],
                    payload
                });
                req.flash('error', error.details[0].message);
                return res.redirect('/dashboard/apps/create');
            }

            const appData = {
                uuid: generateSecureId(),
                userUuid: req.session.user.uuid,
                appName: payload.appName,
                paymentModes: payload.paymentModes,
                appId: generateSecureId(),
                apiKey: generateApiKey(),
                appSecret: generateApiKey(),
                shouldSendClientCallback: payload.shouldSendCallback,
                appCallbackUrl: payload.callbackUrl,
                isActive: true
            };

            logger.info('Creating app with data:', { 
                ...appData,
                apiKey: '***hidden***',
                appSecret: '***hidden***'
            });

            await db.UserApp.create(appData);
            
            logger.info('App created successfully:', { 
                appId: appData.appId,
                uuid: appData.uuid 
            });

            req.flash('success', 'Application created successfully');
            res.redirect('/dashboard/apps');
        } catch (error) {
            logger.error('Error creating app:', {
                error: error.message,
                stack: error.stack,
                payload: req.body
            });
            req.flash('error', 'Failed to create application');
            res.redirect('/dashboard/apps/create');
        }
    },

    // Validate app name
    validateAppName: async (req, res) => {
        try {
            const { name } = req.query;
            const existingApp = await db.UserApp.findOne({
                where: { 
                    userUuid: req.session.user.uuid,
                    appName: name
                }
            });

            if (existingApp) {
                return res.json({ valid: false, message: 'Application name already exists' });
            }

            res.json({ valid: true });
        } catch (error) {
            logger.error('Error validating app name', error);
            res.status(500).json({ valid: false, message: 'Error validating application name' });
        }
    },

    // Test API page
    testApi: async (req, res) => {
        try {
            const app = await db.UserApp.findOne({
                where: { 
                    uuid: req.params.appId,
                    userUuid: req.session.user.uuid 
                }
            });

            if (!app) {
                req.flash('error', 'Application not found');
                return res.redirect('/dashboard/apps');
            }

            res.render('dashboard/apps/test', {
                title: 'Test API',
                layout: 'layouts/dashboard',
                path: '/dashboard/apps',
                app
            });
        } catch (error) {
            logger.error('Error loading test API page:', error);
            req.flash('error', 'Failed to load test API page');
            res.redirect('/dashboard/apps');
        }
    },

    // New methods
    editAppView: async (req, res) => {
        try {
            const app = await db.UserApp.findOne({
                where: { 
                    uuid: req.params.appId,
                    userUuid: req.session.user.uuid 
                }
            });

            if (!app) {
                req.flash('error', 'Application not found');
                return res.redirect('/dashboard/apps');
            }

            res.render('dashboard/apps/edit', {
                title: 'Edit Application',
                layout: 'layouts/dashboard',
                path: '/dashboard/apps',
                app,
                paymentModes: PAYMENT_MODE_LABELS
            });
        } catch (error) {
            logger.error('Error loading edit app page:', error);
            req.flash('error', 'Failed to load application');
            res.redirect('/dashboard/apps');
        }
    },

    updateApp: async (req, res) => {
        try {
            const app = await db.UserApp.findOne({
                where: { 
                    uuid: req.params.appId,
                    userUuid: req.session.user.uuid 
                }
            });

            if (!app) {
                req.flash('error', 'Application not found');
                return res.redirect('/dashboard/apps');
            }

            const updates = {
                paymentModes: Array.isArray(req.body['paymentModes[]']) 
                    ? req.body['paymentModes[]'] 
                    : [req.body['paymentModes[]']],
                shouldSendClientCallback: req.body.shouldSendCallback === 'true',
                appCallbackUrl: req.body.callbackUrl,
                isActive: req.body.isActive === 'true'
            };

            await app.update(updates);
            
            req.flash('success', 'Application updated successfully');
            res.redirect('/dashboard/apps');
        } catch (error) {
            logger.error('Error updating app:', error);
            req.flash('error', 'Failed to update application');
            res.redirect(`/dashboard/apps/${req.params.appId}/edit`);
        }
    }
};

module.exports = controller;