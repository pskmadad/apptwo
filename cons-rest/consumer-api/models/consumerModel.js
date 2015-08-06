/**
 * Created by svaithiyanathan on 8/4/15.
 */

var validator = require('validator');
var Errors = require('../models/errorModel').Errors;
var MissingParamError = require('../models/errorModel').MissingParamError;
var InvalidValueError = require('../models/errorModel').InvalidValueError;
var InvalidSizeError = require('../models/errorModel').InvalidSizeError;

var API_DB_MAPPER = {
    MOBILE_NUMBER : ['mobileNo', 'primary_mobile_no'],  //Nullable
    ALT_MOBILE_NUMBER : ['altMobileNo', 'alt_mobile_no'], //Nullable
    CHANNEL : ['channel','created_channel'],
    UUID : ['uuid', 'uuid'], //Nullable
    EMAIL : ['email', 'email'], //Nullable
    VERIFIED : ['verified', 'verified'],
    GENERATED_PIN : [null, 'gen_pin'],
    STATUS : [null, 'status'],
    ATTEMPT_COUNT : [null, 'attempt_count'],
    OVERALL_SAVE : [null, 'overall_save'],
    LAST_REDEEM_DATE : [null, 'last_redeem'], //Nullable
    SAVINGS_BALANCE : [null, 'savings_balance'],
    LAST_ACCESSED_CHANNEL : ['channel', 'last_accessed_channel'],
    CREATED_DATE : [null, 'created_date'],
    CREATED_BY : ['user', 'created_by'],
    UPDATED_BY : ['user', 'updated_by'],
    UPDATED_DATE : [null, 'updated_date'],
    LAST_LOGGED_IN : [null,'last_logged_in']
};


var CHANNEL_TYPE = {
    WEB : 'web',
    ANDROID : 'android',
    IOS : 'ios',
    WINDOWS : 'windows',
    OTHERS : 'others'
};

var Consumer = function(req) {
    this.mobileNo = req.body[API_DB_MAPPER.MOBILE_NUMBER[0]];
    this.channel = req.body[API_DB_MAPPER.CHANNEL[0]] || 'Unknown';
    this.uuid = req.body[API_DB_MAPPER.UUID[0]];
    this.email = req.body[API_DB_MAPPER.EMAIL[0]];
    this.verified = req.body[API_DB_MAPPER.VERIFIED[0]];
    this.updatedBy = req.body[API_DB_MAPPER.UPDATED_BY[0]];

    this.validate = function(){
        var errors = new Errors();
        if(validator.isNull(this.mobileNo)){
            errors.add(new MissingParamError(API_DB_MAPPER.MOBILE_NUMBER));
        }else{
            this.mobileNo = this.mobileNo.replace(/\./g,'+').replace(/\./g,')').replace(/\./g,'(');
            if(validator.isAlpha(this.mobileNo)){
              errors.add(new InvalidValueError(API_DB_MAPPER.MOBILE_NUMBER));
            }
            if(!validator.isLength(this.mobileNo, 10, 12)){
              errors.add(new InvalidSizeError(API_DB_MAPPER.MOBILE_NUMBER));
            }
        }

        if(this.channel === CHANNEL_TYPE.WEB && validator.isNull()){
            errors.add(new MissingParamError(API_DB_MAPPER.EMAIL));
        }
        if((this.channel === CHANNEL_TYPE.ANDROID || this.channel == CHANNEL_TYPE.IOS
            || this.channel === CHANNEL_TYPE.WINDOWS) && validator.isNull(this.uuid)){
            errors.add(new MissingParamError(API_DB_MAPPER.UUID));
        }

        if(errors.hasError){
            throw errors;
        }
    };

    this.toDBObject = function(){
      var obj = {};
      obj[API_DB_MAPPER.CHANNEL] = this.channel;
      if(!validator.isNull(this.mobileNo)) obj[API_DB_MAPPER.MOBILE_NUMBER] = this.mobileNo;
      if(!validator.isNull(this.uuid)) obj[API_DB_MAPPER.UUID] = this.uuid;
      if(!validator.isNull(this.email)) obj[API_DB_MAPPER.EMAIL] = this.email;
      return obj;
    };
}

module.exports.Consumer = Consumer;
module.exports.API_PARAMS = API_DB_MAPPER;