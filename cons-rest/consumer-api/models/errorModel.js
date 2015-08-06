/**
 * Created by svaithiyanathan on 8/4/15.
 */

var GenericError = function(code, field, message){
    this.field = field;
    this.code = code;
    this.message = message;
}

var MissingParamError = function(field){
    this.field = field;
    this.code = 400;
    this.message = 'Missing Parameter';
}

var InvalidValueError = function(field){
    this.field = field;
    this.code = 412;
    this.message = 'Invalid Value';
}

var InvalidSizeError = function(field){
    this.field = field;
    this.code = 412;
    this.message = 'Invalid field size';
}

var InternalServerError = function(){
  return {
    message : 'Internal Server Error',
    status : 500
  };
}

var Errors = function(){
  this.all = [];
  this.hasError = false;
  this.status = 200;
  this.add = function(error){
      this.hasError = true;
      this.all.push(error);
  }
}

module.exports.GenericError = GenericError;
module.exports.MissingParamError = MissingParamError;
module.exports.InvalidValueError = InvalidValueError;
module.exports.InvalidSizeError = InvalidSizeError;
module.exports.Errors = Errors;
module.exports.InternalServerError = InternalServerError;