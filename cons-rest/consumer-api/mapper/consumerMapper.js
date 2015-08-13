/**
 * Created by svaithiyanathan on 8/8/15.
 */
var validator = new (require('../lib/validator'));
var mergeFields = require('../lib/mapper').mergeFields;

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
        validation : [validator.INSERT_NOT_ALLOWED]
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
    EMAIL: {
        field: DB_PARAMS.EMAIL
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
    },
    isMobile: function(input) {
        return input === this.ANDROID || input === this.IOS || input === this.WINDOWS;
    }
};


module.exports.FIELDS = mergeFields(DB_PARAMS, API_PARAMS);
module.exports.CHANNEL_TYPE = CHANNEL_TYPE;
