const db = require('../../models');
const { generateApiKey } = require('../../utils/security');
const logger = require('../../utils/logger');

const controller = {
    // Get app credentials
    getCredentials: async (req, res) => {
        try {
            const { appId } = req.params;
            const app = await db.UserApp.findOne({
                where: { 
                    uuid: appId,
                    userUuid: req.session.user.uuid 
                }
            });

            if (!app) {
                return res.status(404).json({ 
                    error: 'Application not found' 
                });
            }

            res.json({
                appName: app.appName,
                appId: app.appId,
                apiKey: app.apiKey,
                appSecret: app.appSecret
            });
        } catch (error) {
            logger.error('Error fetching app credentials:', error);
            res.status(500).json({ 
                error: 'Failed to fetch credentials' 
            });
        }
    },

    // Regenerate app credentials
    regenerateCredentials: async (req, res) => {
        try {
            const { appId } = req.params;
            const app = await db.UserApp.findOne({
                where: { 
                    uuid: appId,
                    userUuid: req.session.user.uuid 
                }
            });

            if (!app) {
                return res.status(404).json({ 
                    error: 'Application not found' 
                });
            }

            // Generate new credentials
            const newApiKey = generateApiKey();
            const newAppSecret = generateApiKey();

            // Update app
            await app.update({
                apiKey: newApiKey,
                appSecret: newAppSecret
            });

            res.json({
                apiKey: newApiKey,
                appSecret: newAppSecret
            });
        } catch (error) {
            logger.error('Error regenerating app credentials:', error);
            res.status(500).json({ 
                error: 'Failed to regenerate credentials' 
            });
        }
    }
};

module.exports = controller;