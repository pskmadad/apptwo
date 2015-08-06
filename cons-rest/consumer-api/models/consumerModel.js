/**
 * Created by svaithiyanathan on 8/4/15.
 */

var validator = require('validator');
var Errors = require('./errorModel').Errors;
var MissingParamError = require('./errorModel').MissingParamError;
var InvalidValueError = require('./errorModel').InvalidValueError;
var InvalidSizeError = require('./errorModel').InvalidSizeError;
var req2Domain = require('../lib/mapper').req2Domain;
var logger = require('../lib/logger').logger;
var DB = require('../lib/DB').DB;
var db = new DB();

var TABLE_NAME = 'm_consumers';

var API_MAPPER = {
    ID: 'id',
    PRIMARY_MOBILE_NO: 'primary_mobile_no',
    ALT_MOBILE_NO: 'alt_mobile_no',
    EMAIL: 'email',
    VERIFIED: 'verified',
    GEN_PIN: 'gen_pin',
    STATUS: 'status',
    ATTEMPT_COUNT: 'attempt_count',
    UUID: 'uuid',
    OVERALL_SAVE: 'overall_save',
    LAST_REDEEM: 'last_redeem',
    SAVINGS_BALANCE: 'savings_balance',
    LAST_ACCESSED_CHANNEL: 'last_accessed_channel',
    CREATED_CHANNEL: 'created_channel',
    CREATED_DATE: 'created_date',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by',
    UPDATED_DATE: 'updated_date',
    LAST_LOGGED_IN: 'last_logged_in'
};

var CHANNEL_TYPE = {
    WEB: 'web',
    ANDROID: 'android',
    IOS: 'ios',
    WINDOWS: 'windows',
    OTHERS: 'others'
};

var Consumer = function(req) {
    var obj = req2Domain(API_MAPPER, req);
    logger.debug('Consumer :' + JSON.stringify(obj));

    function createValidation() {
        var errors = new Errors();

        //Primary Mobile Validation
        var mobileNo = obj[API_MAPPER.PRIMARY_MOBILE_NO];
        if(validator.isNull(mobileNo)) {
            errors.add(new MissingParamError(API_MAPPER.PRIMARY_MOBILE_NO));
        } else {
            obj[API_MAPPER.PRIMARY_MOBILE_NO] = mobileNo.replace(/\./g, '+').replace(/\./g, ')').replace(/\./g, '(');
            if(validator.isAlpha(mobileNo)) {
                errors.add(new InvalidValueError(API_MAPPER.PRIMARY_MOBILE_NO));
            }
            if(!validator.isLength(mobileNo, 10, 12)) {
                errors.add(new InvalidSizeError(API_MAPPER.PRIMARY_MOBILE_NO));
            }
        }

        //Email Validation
        if(obj[API_MAPPER.CREATED_CHANNEL] === CHANNEL_TYPE.WEB && validator.isNull(obj[API_MAPPER.EMAIL])) {
            errors.add(new MissingParamError(API_MAPPER.EMAIL));
        }

        //UUID Validation
        var channel = obj[API_MAPPER.CREATED_CHANNEL];
        if((channel === CHANNEL_TYPE.ANDROID || channel == CHANNEL_TYPE.IOS || channel === CHANNEL_TYPE.WINDOWS) && validator.isNull(obj[API_MAPPER.UUID])) {
            errors.add(new MissingParamError(API_MAPPER.UUID));
        }

        if(errors.hasError) {
            throw errors;
        }
    }

    function setDefaults() {
        //Set Defaults
        var channel = obj[API_MAPPER.CREATED_CHANNEL] || 'Unknown';
        obj[API_MAPPER.CREATED_CHANNEL] = channel;
    }

    this.executeCreateCustomer = function(callback) {
        //Do validation
        createValidation();

        db.create(callback, 'INSERT INTO ' + TABLE_NAME + ' SET ?', obj);
    };

    this.toObj = function() {
        return obj;
    };
}

module.exports.Consumer = Consumer;
//module.exports.API_PARAMS = API_MAPPER;
