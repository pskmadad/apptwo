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
    VERIFIED: {db: 'verified', show: true, default: 'N'},
    GEN_PIN: {db: 'gen_pin', show: true, default: Math.round(Math.random() * 100000)},
    STATUS: {db: 'status', show: true, default: 'PENDING'},
    UUID: 'uuid',
    OVERALL_SAVE: {db: 'overall_save', show: true, default: 0},
    LAST_REDEEM: 'last_redeem',
    SAVINGS_BALANCE: {db: 'savings_balance', show: true, default: 0},
    ATTEMPT_COUNT: {db: 'attempt_count', show: false, default: 0},
    LAST_ACCESSED_CHANNEL: {db: 'last_accessed_channel', api: 'channel', show: true},
    CREATED_CHANNEL: {db: 'created_channel', show: true},
    CREATED_DATE: {db: 'created_date', show: false},
    CREATED_BY: {db: 'created_by', show: true},
    UPDATED_BY: {db: 'updated_by', api: 'user', show: true},
    UPDATED_DATE: {db: 'updated_date', api: 'modified_date', show: true, default: new Date()},
    LAST_LOGGED_IN: {db: 'last_logged_in', api: 'accessed_date', show: true, default: new Date()}
};

var CHANNEL_TYPE = {
    WEB: 'W',
    ANDROID: 'A',
    IOS: 'I',
    WINDOWS: 'D',
    OTHERS: 'O',
    isValid: function(input) {
        return input === this.WEB || input === this.ANDROID || input === this.IOS || input === this.WINDOWS || input === this.OTHERS;
    }
};

var Consumer = function(req) {
    var obj = req2Domain(API_MAPPER, req, true);
    logger.debug('Consumer :' + JSON.stringify(obj));

    function createValidation() {
        var errors = new Errors();

        //Primary Mobile Validation
        var mobileNo = obj[API_MAPPER.PRIMARY_MOBILE_NO];
        if(validator.isNull(mobileNo)) {
            errors.add(new MissingParamError(API_MAPPER.PRIMARY_MOBILE_NO));
        } else {
            mobileNo = obj[API_MAPPER.PRIMARY_MOBILE_NO] = mobileNo.replace(/\./g, '+').replace(/\./g, ')').replace(/\./g, '(');
            if(validator.isAlpha(mobileNo)) {
                errors.add(new InvalidValueError(API_MAPPER.PRIMARY_MOBILE_NO));
            }
            if(!validator.isLength(mobileNo, 10, 12)) {
                errors.add(new InvalidSizeError(API_MAPPER.PRIMARY_MOBILE_NO));
            }
        }

        var channel = obj[API_MAPPER.LAST_ACCESSED_CHANNEL.db];
        //Channel validation
        if(validator.isNull(channel)) {
            errors.add(new MissingParamError(API_MAPPER.LAST_ACCESSED_CHANNEL.api));
        } else if(!CHANNEL_TYPE.isValid(channel)) {
            errors.add(new InvalidValueError(API_MAPPER.LAST_ACCESSED_CHANNEL.api))
        } else {
            //Email Validation
            if(channel === CHANNEL_TYPE.WEB && validator.isNull(obj[API_MAPPER.EMAIL])) {
                errors.add(new MissingParamError(API_MAPPER.EMAIL));
            }
            //UUID Validation
            if((channel === CHANNEL_TYPE.ANDROID || channel == CHANNEL_TYPE.IOS || channel === CHANNEL_TYPE.WINDOWS) && validator.isNull(obj[API_MAPPER.UUID])) {
                errors.add(new MissingParamError(API_MAPPER.UUID));
            }
        }

        if(errors.hasError()) {
            throw errors;
        }
    }

    this.executeCreateCustomer = function(callback) {
        //Do validation
        createValidation();

        //Set create defaults
        obj[API_MAPPER.CREATED_CHANNEL.db] = obj[API_MAPPER.LAST_ACCESSED_CHANNEL.db];
        obj[API_MAPPER.CREATED_DATE.db] = obj[API_MAPPER.UPDATED_DATE.db];
        obj[API_MAPPER.CREATED_BY.db] = obj[API_MAPPER.UPDATED_BY.db];

        db.create(callback, 'INSERT INTO ' + TABLE_NAME + ' SET ?', obj);
    };

    this.toObj = function() {
        return obj;
    };
}

module.exports.Consumer = Consumer;
//module.exports.API_PARAMS = API_MAPPER;
