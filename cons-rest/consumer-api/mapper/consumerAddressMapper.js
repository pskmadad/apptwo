/**
 * Created by svaithiyanathan on 8/12/15.
 */

var validator = new (require('../lib/validator'));
var mergeFields = require('../lib/mapper').mergeFields;

var DB_PARAMS = {
    ID : 'id',
    CONS_ID: 'consumer_id',
    NAME : 'name',
    BUILDING_NAME : 'building_name',
    ADDRESS : 'address',
    AREA : 'area',
    CITY : 'city',
    STATE : 'state',
    PIN : 'pin',
    LATITUDE : 'latitude',
    LONGITUDE : 'longitude',
    MOBILE_NO : 'mobile_no',
    USED_DATE : 'used_date',
    PREFERRED_ADDRESS : 'preferred_address'
}

var API_PARAMS = {
    ID : {
        cryptoKey: [DB_PARAMS.ID, DB_PARAMS.CONS_ID, DB_PARAMS.CITY, DB_PARAMS.PIN],
        validation : [validator.INSERT_NOT_ALLOWED]
    },
    CONS_ID: {
        validation : [validator.ALWAYS_REQUIRED]
    },
    NAME: {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    BUILDING_NAME : {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    ADDRESS : {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    AREA : {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    CITY : {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    STATE : {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    PIN : {
        validation : [validator.INSERT_REQUIRED, validator.NON_EDITABLE]
    },
    LATITUDE : {},
    LONGITUDE : {},
    MOBILE_NO : {
        validation : [validator.MOBILE]
    },
    USED_DATE : {
        validation: [validator.NON_ACCEPTABLE],
        default: new Date()
    },
    PREFERRED_ADDRESS : {default: 'Y'}
}

module.exports.ADDRESS_FIELDS = mergeFields(DB_PARAMS, API_PARAMS);