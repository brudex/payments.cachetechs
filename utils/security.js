const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const security = {
    generateSecureId: () => {
        return uuidv4();
    },

    generateApiKey: () => {
        return crypto.randomBytes(32).toString('hex');
    }
};

module.exports = security;