const express = require("express");
const cors = require('cors');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const { MOCK_USER } = require('./middlewares/auth.middleware');

const indexRouter = require("./routes/index");
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// Express layouts middleware
app.use(expressLayouts);
app.set('layout', 'layouts/default'); // Set default layout
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Flash messages middleware
app.use(flash());

// Make user available to all templates
app.use((req, res, next) => {
    // For development, always set mock user
    if (process.env.NODE_ENV !== 'production') {
        req.session = req.session || {};
        req.session.user = MOCK_USER;
    }
    
    res.locals.user = req.session.user;
    res.locals.messages = req.flash();
    next();
});

app.use("/", indexRouter);

// Error handlers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if(app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500);
        res.send(err.message);
    });
}

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;