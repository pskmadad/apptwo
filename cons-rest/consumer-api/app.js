var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var config = require('./config/config')[app.settings.env];

//Initialize required objects
require('./lib/logger').initialize(config);
require('./lib/DB').initialize(config);

var consumers = require('./routes/consumers');
var products = require('./routes/products');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(function (req, res, next) {
  req.config = config;
  var changeCase = require('change-case');
  console.log(changeCase.camelCase('m_consumers'));
  console.log(changeCase.camelCase('created_by'));
  console.log(changeCase.snakeCase('mConsumers'));
  console.log(changeCase.snakeCase('createdBySenthil'));
  console.log(Object.keys({hello:'world', comeon:'good', 1:'hello'}));
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', routes);
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
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    //Handled error
    if(err.status === 200){
      res.status(err.status);
      res.json({errors:err});
    } else {
      res.status(err.status || 500);
      res.json(err);
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //Handled error
  if(err.status === 200){
    res.status(err.status);
    res.json({errors:err});
  } else {
    res.status(err.status || 500);
    res.json(err);
  }
});

module.exports = app;
