/**
 * Created by svaithiyanathan on 8/8/15.
 */
var _ = require('underscore');
var validator = new (require('../lib/validator'));

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



var API_PARAMS = {
    ID: {
        cryptoKey: [DB_PARAMS.ID, DB_PARAMS.EMAIL, DB_PARAMS.UUID, DB_PARAMS.PRIMARY_MOBILE_NO],
        nonEditable: true
    },
    PRIMARY_MOBILE_NO: {
        field: 'mobile_no',
        validation: [validator.NON_EDITABLE, validator.INSERT_REQUIRED, validator.MOBILE]
    },
    VERIFIED: {
        validation: [validator.NON_ACCEPTABLE],
        default: 'N'
    },
    GEN_PIN: {
        validation: [validator.NON_ACCEPTABLE],
        default: Math.round(Math.random() * 100000)
    },
    STATUS: { //Updated internally
        validation: [validator.NON_ACCEPTABLE],
        default: 'PENDING'
    },
    UUID: {
        field: DB_PARAMS.UUID
    },
    OVERALL_SAVE: { //Updated whenever order is processed
        validation: [validator.NON_ACCEPTABLE],
        default: 0
    },
    LAST_REDEEM: { //Updated via savings reclaim process
        validation: [validator.NON_ACCEPTABLE]
    },
    SAVINGS_BALANCE: {
        validation: [validator.NON_ACCEPTABLE],
        default: 0
    },
    LAST_ACCESSED_CHANNEL: {
        field: 'channel',
        validation: [validator.ALWAYS_REQUIRED]
    },
    UPDATED_BY: {
        field: 'user',
        validation: [validator.ALWAYS_REQUIRED]
    },
    UPDATED_DATE: {
        field: 'modified_date',
        default: new Date()
    },
    LAST_LOGGED_IN: {
        field: 'accessed_date',
        validation: [validator.INSERT_NOT_ALLOWED],
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
