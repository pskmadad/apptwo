var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('./lib/auth');
var consumers = require('./routes/consumers');
var products = require('./routes/products');

var app = express();
var config = require('./config/config')[app.get('env')];

//Initialize required objects
require('./lib/logger').initialize(config);
require('./lib/DB').initialize(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Inject config object to request and get it wherever required
app.use(function(req, res, next) {
    req.config = config;
    next();
});

// Check for authentication
app.use(auth.ensureAuthentication);

// Routes
app.use('/api/v1/consumers', consumers);
app.use('/api/v1/products', products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    //Handled error
    if(err.status === 200) {
        res.status(err.status);
        res.json({errors: err});
    } else {
        res.status(err.status || 500);
        var errorObj = {
            message: err.message,
            stack: err.details,
            status: err.status || 500
        };
        if(app.get('env') === 'development') {
            res.render('error',errorObj);
        } else {
            res.json({'error': errorObj});
        }
    }
});

module.exports = app;
