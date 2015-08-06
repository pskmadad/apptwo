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

/*app.use(function (req, res, next) {
  req.config = config;
  var changeCase = require('change-case');
  var arr = ['id',
    'primary_mobile_no',
    'alt_mobile_no',
    'email',
    'verified',
    'gen_pin',
    'status',
    'attempt_count',
    'uuid',
    'overall_save',
    'last_redeem',
    'savings_balance',
    'last_accessed_channel',
    'created_channel',
    'created_date',
    'created_by',
    'updated_by',
    'updated_date',
    'last_logged_in'];
  for(var i=0; i<arr.length; i++){
    console.log(changeCase.upperCase(arr[i]) + ' : \''+arr[i]+'\',');
  }

  next();
});*/

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
      return;
    } else {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err.details
      });
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
