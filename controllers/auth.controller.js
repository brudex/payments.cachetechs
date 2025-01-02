const db = require('../models');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { validateUserInput } = require('../utils/validation');

const controller = {
    loginPost: async (req, res) => {
        try {
            const { error } = validateUserInput.login(req.body);
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
            
            if (req.body.remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            }

            res.redirect('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            req.flash('error', 'An error occurred during login');
            res.redirect('/login');
        }
    },

    createUser: async (req, res) => {
        try {
            const { error } = validateUserInput.register(req.body);
            if (error) {
                req.flash('error', error.details[0].message);
                return res.redirect('/register');
            }

            const { email } = req.body;
            const existingUser = await db.User.findOne({ where: { email } });
            
            if (existingUser) {
                req.flash('error', 'Email already registered');
                return res.redirect('/register');
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.User.create({
                ...req.body,
                password: hashedPassword
            });

            req.flash('success', 'Registration successful. Please login.');
            res.redirect('/login');
        } catch (error) {
            console.error('Registration error:', error);
            req.flash('error', 'An error occurred during registration');
            res.redirect('/register');
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
};

module.exports = controller;