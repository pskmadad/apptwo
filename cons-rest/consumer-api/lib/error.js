/**
 * Created by svaithiyanathan on 8/4/15.
 */

var GenericError = function(code, field, message) {
    this.field = field;
    this.code = code;
    this.message = message;
}

var MissingParamError = function(field) {
    this.field = field;
    this.code = 400;
    this.message = 'Missing Parameter';
}

var InvalidValueError = function(field) {
    this.field = field;
    this.code = 412;
    this.message = 'Invalid Value';
}

var InvalidSizeError = function(field) {
    this.field = field;
    this.code = 412;
    this.message = 'Invalid field size';
}

var NoDataFoundError = function(field) {
    this.field = field;
    this.code = 404;
    this.message = 'No Data found';
}

var InternalServerError = function(err) {
    return {
        message: 'Internal Server Error',
        status: 500,
        details: err
    };
}

var Errors = function() {
    this.all = [];
    var hasError = false;
    this.status = 200;
    this.add = function(error) {
        hasError = true;
        this.all.push(error);
    };
    this.hasError = function() {
        return hasError;
    }
}

var UserExists = function(err) {
    this.field = 'Consumer';
    this.message = 'User exists in system';
    this.code = 413;
}

module.exports.GenericError = GenericError;
module.exports.MissingParamError = MissingParamError;
module.exports.InvalidValueError = InvalidValueError;
module.exports.InvalidSizeError = InvalidSizeError;
module.exports.Errors = Errors;
module.exports.InternalServerError = InternalServerError;
module.exports.NoDataFoundError = NoDataFoundError;
module.exports.UserExists = UserExists;