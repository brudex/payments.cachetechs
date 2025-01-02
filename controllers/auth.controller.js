const bcrypt = require('bcryptjs');
const db = require('../models');
const validation = require('../utils/validation');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const controller = {
    loginPost: async (req, res) => {
        try {
            const { error } = validation.validateUserInput.login(req.body);
            if (error) {
                req.flash('error', error.details[0].message);
                return res.redirect('/login');
            }

            const { email, password } = req.body;
            const user = await db.User.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }

            req.session.user = {
                id: user.id,
                uuid: user.uuid,
                email: user.email,
                fullName: user.fullName
            };
            
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Login error:', error);
            req.flash('error', 'An error occurred during login');
            res.redirect('/login');
        }
    },

    createUser: async (req, res) => {
        try {
            logger.info('Registration attempt', { email: req.body.email });
            
            const { error } = validation.validateUserInput.register(req.body);
            if (error) {
                logger.warn('Registration validation failed', { error: error.details[0] });
                req.flash('error', error.details[0].message);
                return res.redirect('/register');
            }

            const { email, fullName, companyName, phoneNumber, password } = req.body;
            
            // Check if user exists
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                logger.warn('Registration failed - Email exists', { email });
                req.flash('error', 'Email already registered');
                return res.redirect('/register');
            }

            // Create user
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.User.create({
                uuid: uuidv4(),
                fullName,
                companyName,
                email,
                phoneNumber,
                password: hashedPassword
            });

            logger.info('User registered successfully', { email });
            
            // Render success page instead of redirecting
            res.render('auth/register-success', {
                title: 'Registration Successful',
                layout: 'layouts/default'
            });
        } catch (error) {
            logger.error('Registration error', error);
            req.flash('error', 'An error occurred during registration');
            res.redirect('/register');
        }
    },

    logout: (req, res) => {
        if (req.session) {
            const userEmail = req.session.user?.email;
            req.session.destroy(() => {
                logger.info('User logged out', { email: userEmail });
                res.redirect('/login');
            });
        } else {
            res.redirect('/login');
        }
    }
};

module.exports = controller;