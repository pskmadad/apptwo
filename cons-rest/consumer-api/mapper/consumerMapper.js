/**
 * Created by svaithiyanathan on 8/8/15.
 */
var _ = require('underscore');
var validator = require('validator');
var MissingParamError = require('./errorMapper').MissingParamError;
var InvalidValueError = require('./errorMapper').InvalidValueError;
var InvalidSizeError = require('./errorMapper').InvalidSizeError;

/*
 var DB_PARAMS = [
 'id', 'email', 'primary_mobile_no', 'uuid','alt_mobile_no', 'verified', 'gen_pin', 'status',  'overall_save', 'last_redeem',
 'savings_balance', 'attempt_count', 'last_accessed_channel', 'created_channel', 'created_date', 'created_by', 'updated_by', 'updated_date', 'last_logged_in'
 ];
 */

var DB_PARAMS = {
    ID: 'id',
    PRIMARY_MOBILE_NO: 'primary_mobile_no',
    ALT_MOBILE_NO: 'alt_mobile_no',
    EMAIL: 'email',
    VERIFIED: 'verified',
    GEN_PIN: 'gen_pin',
    STATUS: 'status',
    UUID: 'uuid',
    OVERALL_SAVE: 'overall_save',
    LAST_REDEEM: 'last_redeem',
    SAVINGS_BALANCE: 'savings_balance',
    ATTEMPT_COUNT: 'attempt_count',
    LAST_ACCESSED_CHANNEL: 'last_accessed_channel',
    CREATED_CHANNEL: 'created_channel',
    CREATED_DATE: 'created_date',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by',
    UPDATED_DATE: 'updated_date',
    LAST_LOGGED_IN: 'last_logged_in'
};

/*var DB_PARAMS = {
 ID: 'ID',
 PRIMARY_MOBILE_NO: 'PRIMARY_MOBILE_NO',
 ALT_MOBILE_NO: 'ALT_MOBILE_NO',
 EMAIL: 'EMAIL',
 VERIFIED: 'VERIFIED',
 GEN_PIN: 'GEN_PIN',
 STATUS: 'STATUS',
 UUID: 'UUID',
 OVERALL_SAVE: 'OVERALL_SAVE',
 LAST_REDEEM: 'LAST_REDEEM',
 SAVINGS_BALANCE: 'SAVINGS_BALANCE',
 ATTEMPT_COUNT: 'ATTEMPT_COUNT',
 LAST_ACCESSED_CHANNEL: 'LAST_ACCESSED_CHANNEL',
 CREATED_CHANNEL: 'CREATED_CHANNEL',
 CREATED_DATE: 'CREATED_DATE',
 CREATED_BY: 'CREATED_BY',
 UPDATED_BY: 'UPDATED_BY',
 UPDATED_DATE: 'UPDATED_DATE',
 LAST_LOGGED_IN: 'LAST_LOGGED_IN'
 };
 */
function NON_EDITABLE(errors, field, data, reqType) {
    if(reqType === 'edit' && !validator.isNull(data)) {
        errors.add(new InvalidValueError(field));
    }
}

function INSERT_REQUIRED(errors, field, data, reqType) {
    if(reqType === 'new' && validator.isNull(data)) {
        errors.add(new MissingParamError(field));
    }
}
function INSERT_NOT_ALLOWED(errors, field, data, reqType) {
    if(reqType === 'new' && !validator.isNull(data)) {
        errors.add(new InvalidValueError(field));
    }
}
function MOBILE(errors, field, data, reqType) {
    if(data) {
        data = data.replace(/\./g, '+').replace(/\./g, ')').replace(/\./g, '(');
        if(validator.isAlpha(data)) {
            errors.add(new InvalidValueError(field));
        }
        if(!validator.isLength(data, 10, 12)) {
            errors.add(new InvalidSizeError(field));
        }
    }
}
function NON_ACCEPTABLE(errors, field, data, reqType) {
    if(!validator.isNull(data)) {
        errors.add(new InvalidValueError(field));
    }
}
function ALWAYS_REQUIRED(errors, field, data, reqType) {
    if(validator.isNull(data)) {
        errors.add(new MissingParamError(field));
    }
}

var API_PARAMS = {
    ID: {
        cryptoKey: [DB_PARAMS.ID, DB_PARAMS.EMAIL, DB_PARAMS.UUID, DB_PARAMS.PRIMARY_MOBILE_NO],
        nonEditable: true
    },
    PRIMARY_MOBILE_NO: {
        field: 'mobile_no',
        validation: [NON_EDITABLE, INSERT_REQUIRED, MOBILE]
    },
    VERIFIED: {
        validation: [NON_ACCEPTABLE],
        default: 'N'
    },
    GEN_PIN: {
        validation: [NON_ACCEPTABLE],
        default: Math.round(Math.random() * 100000)
    },
    STATUS: { //Updated internally
        validation: [NON_ACCEPTABLE],
        default: 'PENDING'
    },
    UUID: {
        field: DB_PARAMS.UUID
    },
    OVERALL_SAVE: { //Updated whenever order is processed
        validation: [NON_ACCEPTABLE],
        default: 0
    },
    LAST_REDEEM: { //Updated via savings reclaim process
        validation: [NON_ACCEPTABLE]
    },
    SAVINGS_BALANCE: {
        validation: [NON_ACCEPTABLE],
        default: 0
    },
    LAST_ACCESSED_CHANNEL: {
        field: 'channel',
        validation: [ALWAYS_REQUIRED]
    },
    UPDATED_BY: {
        field: 'user',
        validation: [ALWAYS_REQUIRED]
    },
    UPDATED_DATE: {
        field: 'modified_date',
        default: new Date()
    },
    LAST_LOGGED_IN: {
        field: 'accessed_date',
        validation: [INSERT_NOT_ALLOWED],
        default: new Date()
    }
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

function initialize() {
    FINAL_FIELDS = {};
    var keys = Object.keys(DB_PARAMS);
    for(var i = 0; i < keys.length; i++) {
        var dest = {mappedTo: DB_PARAMS[keys[i]]};
        if(API_PARAMS[keys[i]] && !API_PARAMS[keys[i]].field) {
            dest['field'] = dest['mappedTo'];
        }
        FINAL_FIELDS[keys[i]] = _.extend(API_PARAMS[keys[i]] || {hideToApi: true, field: dest['mappedTo']}, dest);
    }
    console.log('Initialized Fields....');
    return FINAL_FIELDS;
}

var FINAL_FIELDS;

module.exports.FIELDS = initialize();
module.exports.CHANNEL_TYPE = CHANNEL_TYPE;
