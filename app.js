const express = require("express");
const cors = require('cors');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require("./routes/index");
const app = express();

app.use(logger("dev"));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
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

app.use("/", indexRouter);

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