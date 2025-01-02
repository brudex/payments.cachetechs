const logger = require('../utils/logger');

// Mock user for testing
const MOCK_USER = {
    id: 1,
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    email: 'demo@example.com',
    fullName: 'Demo User'
};

const isAuthenticated = (req, res, next) => {
    // For development, always set mock user
    if (process.env.NODE_ENV !== 'production') {
        req.session = req.session || {};
        req.session.user = MOCK_USER;
        return next();
    }

    // Normal authentication check
    if (req.session && req.session.user) {
        return next();
    }

    logger.warn('Unauthorized access attempt', { 
        path: req.path,
        ip: req.ip
    });
    
    req.flash('error', 'Please login to continue');
    res.redirect('/login');
};

module.exports = { 
    isAuthenticated,
    MOCK_USER // Export for use in other parts of the application
};