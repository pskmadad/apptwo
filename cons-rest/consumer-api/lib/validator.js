/**
 * Created by svaithiyanathan on 8/10/15.
 */
var MissingParamError = require('./error').MissingParamError;
var InvalidValueError = require('./error').InvalidValueError;
var InvalidSizeError = require('./error').InvalidSizeError;
var validator = require('validator');

module.exports = function() {
    this.NON_EDITABLE = function (errors, field, data, reqType) {
        if(reqType === 'edit' && !validator.isNull(data)) {
            errors.add(new InvalidValueError(field));
        }
    };

    this.INSERT_REQUIRED = function (errors, field, data, reqType) {
        if(reqType === 'new' && validator.isNull(data)) {
            errors.add(new MissingParamError(field));
        }
    };

    this.INSERT_NOT_ALLOWED = function (errors, field, data, reqType) {
        if(reqType === 'new' && !validator.isNull(data)) {
            errors.add(new InvalidValueError(field));
        }
    };

    this.MOBILE = function (errors, field, data, reqType) {
        if(data) {
            data = data.replace(/\./g, '+').replace(/\./g, ')').replace(/\./g, '(');
            if(validator.isAlpha(data)) {
                errors.add(new InvalidValueError(field));
            }
            if(!validator.isLength(data, 10, 12)) {
                errors.add(new InvalidSizeError(field));
            }
        }
    };

    this.NON_ACCEPTABLE = function (errors, field, data, reqType) {
        if(!validator.isNull(data)) {
            errors.add(new InvalidValueError(field));
        }
    };

    this.ALWAYS_REQUIRED = function (errors, field, data, reqType) {
        console.log('ALWAYS_REQUIRED '+errors);
        if(validator.isNull(data)) {
            errors.add(new MissingParamError(field));
        }
    };
};