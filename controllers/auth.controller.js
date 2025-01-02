const db = require("../models");
const bcrypt = require("bcryptjs");
const uuid = require('uuid');

const controller = {
    loginPost: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await db.User.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }

            req.session.user = {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            };
            
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            req.flash('error', 'An error occurred during login');
            res.redirect('/login');
        }
    },

    createUserPost: async (req, res) => {
        try {
            const { fullName, companyName, email, phoneNumber, password } = req.body;
            
            // Check if user exists
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                req.flash('error', 'Email already registered');
                return res.redirect('/register');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            await db.User.create({
                uuid: uuid.v4(),
                fullName,
                companyName,
                email,
                phoneNumber,
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
        req.session.destroy();
        res.redirect('/login');
    }
};

module.exports = controller;