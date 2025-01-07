const db = require('../models');
const bcrypt = require('bcryptjs');
const { validateProfileUpdate, validatePasswordChange } = require('../utils/validation/profile.validation');
const logger = require('../utils/logger');
const { MOCK_USER } = require('../utils/mock/user.mock');

const controller = {
    showProfile: async (req, res) => {
        try {
            // Use mock user in development
            if (process.env.NODE_ENV !== 'production') {
                return res.render('dashboard/profile/edit', {
                    title: 'Edit Profile',
                    layout: 'layouts/dashboard',
                    path: '/dashboard/profile',
                    user: MOCK_USER
                });
            }

            // Production code path
            const userUuid = req.session.user?.uuid;
            
            if (!userUuid) {
                logger.error('No user UUID in session');
                req.flash('error', 'Please login to continue');
                return res.redirect('/login');
            }

            const user = await db.User.findOne({
                where: { uuid: userUuid }
            });

            if (!user) {
                logger.error('User not found:', { uuid: userUuid });
                req.flash('error', 'User not found');
                return res.redirect('/dashboard');
            }

            res.render('dashboard/profile/edit', {
                title: 'Edit Profile',
                layout: 'layouts/dashboard',
                path: '/dashboard/profile',
                user: user.toJSON()
            });
        } catch (error) {
            logger.error('Error loading profile:', error);
            req.flash('error', 'Failed to load profile');
            res.redirect('/dashboard');
        }
    },

    // Other methods remain unchanged...
    updateProfile: async (req, res) => {
        try {
            // Use mock user in development
            if (process.env.NODE_ENV !== 'production') {
                req.flash('success', 'Profile updated successfully (Mock)');
                return res.redirect('/dashboard/profile');
            }

            const { error } = validateProfileUpdate(req.body);
            if (error) {
                req.flash('error', error.details[0].message);
                return res.redirect('/dashboard/profile');
            }

            const { fullName, companyName, phoneNumber } = req.body;
            const userUuid = req.session.user?.uuid;

            if (!userUuid) {
                req.flash('error', 'Please login to continue');
                return res.redirect('/login');
            }

            const user = await db.User.findOne({ where: { uuid: userUuid } });
            
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/dashboard');
            }

            await user.update({ fullName, companyName, phoneNumber });

            // Update session data
            req.session.user = {
                ...req.session.user,
                fullName
            };

            req.flash('success', 'Profile updated successfully');
            res.redirect('/dashboard/profile');
        } catch (error) {
            logger.error('Error updating profile:', error);
            req.flash('error', 'Failed to update profile');
            res.redirect('/dashboard/profile');
        }
    },

    showChangePassword: async (req, res) => {
        res.render('dashboard/profile/change-password', {
            title: 'Change Password',
            layout: 'layouts/dashboard',
            path: '/dashboard/profile'
        });
    },

    changePassword: async (req, res) => {
        try {
            // Use mock user in development
            if (process.env.NODE_ENV !== 'production') {
                req.flash('success', 'Password changed successfully (Mock)');
                return res.redirect('/dashboard/profile/password');
            }

            const { error } = validatePasswordChange(req.body);
            if (error) {
                req.flash('error', error.details[0].message);
                return res.redirect('/dashboard/profile/password');
            }

            const userUuid = req.session.user?.uuid;
            if (!userUuid) {
                req.flash('error', 'Please login to continue');
                return res.redirect('/login');
            }

            const user = await db.User.findOne({
                where: { uuid: userUuid }
            });

            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/dashboard');
            }

            const { currentPassword, newPassword } = req.body;
            const isValid = await bcrypt.compare(currentPassword, user.password);
            
            if (!isValid) {
                req.flash('error', 'Current password is incorrect');
                return res.redirect('/dashboard/profile/password');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashedPassword });

            req.flash('success', 'Password changed successfully');
            res.redirect('/dashboard/profile/password');
        } catch (error) {
            logger.error('Error changing password:', error);
            req.flash('error', 'Failed to change password');
            res.redirect('/dashboard/profile/password');
        }
    }
};

module.exports = controller;