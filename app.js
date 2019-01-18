//this app.js file is the whole backend project for oceanbed

//all files and folders created should now communicate with this app.js file
var express = require('express');
var app = express();	//this app variable is entire express framework

var morgan = require('morgan');
var bodyParser = require('body-parser');	//middleware to parse data passed from req.body >> x-www-form-urlencoded and json data
var expressValidator = require('express-validator');
var config = require('./config/config');	//contains all configuraion info

var path = require('path');

var authRoute = require('./routes/auth')(config);
var dashboard = require('./routes/dashboard')();
require('./db')(config);
var authenticate = require('./middlewares/authenticate');
//USER ROUTE LEFT
//DASHBOARD LEFT
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(expressValidator());


app.use('/auth', authRoute);
app.use('/dashboard', authenticate, dashboard);

app.use(function(req, res, next) {
    console.log('I am last application level middleware');
    next({
        status: 404,
        message: 'Not Found'
    });
});

//error handling middleware
app.use(function(err, req, res, next) {
    console.log("Err is ", err);
    console.log("I am at error handling middleware");
    res.json({
        status: err.status || 400,
        msg: err.message || "Something went wrong"
    });
});

app.listen(config.port, function(err, done) {
    if (err) {
        console.log("Server failed");
    } else {
        console.log("Server listening at port ", config.port);
        console.log("press CTRL + C to exit the server");
    }
});