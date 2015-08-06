/**
 * Created by svaithiyanathan on 8/5/15.
 */
var winston = require('winston');

var internalLogger = new (winston.Logger)();

module.exports.initialize = function(config){
  if(config.log.console) {
    internalLogger.add(winston.transports.Console,{ level: 'debug' });
  }
  if(config.log.file) {
    internalLogger.add(winston.transports.File, {filename: config.log.filename});
  }
};

module.exports.logger = internalLogger;