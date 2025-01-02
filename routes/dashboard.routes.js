const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    // Providing mock user data since we bypassed authentication
    const mockUser = {
        fullName: 'Demo User'
    };
    
    res.render('dashboard/index', {
        user: mockUser,
        layout: 'layouts/dashboard'
    });
});

module.exports = router;