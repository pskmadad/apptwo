/**
 * Created by svaithiyanathan on 8/13/15.
 */

var Errors = require('../lib/error').Errors;
var req2Domain = require('../lib/mapper').req2Domain;
var FIELDS = require('../mapper/consumerAddressMapper').ADDRESS_FIELDS;
var CONS_FIELDS = require('../mapper/consumerMapper').FIELDS;
var decryptConsumerId = require('./consumerModel').decryptConsumerId;
var InvalidValueError = require('../lib/error').InvalidValueError;
var logger = require('../lib/logger').logger;

var ConsumerAddress = function(req) {
    var request = req;
    var errors = new Errors();

    this.createAddress = function(consId, callback){
        var options = {error: errors, reqType: 'new', useDefault: true, prefix:'address'};
        var consumer = decryptConsumerId(consId, errors);
        if(errors.hasError()){
            return callback(new InvalidValueError(FIELDS.CONS_ID.field));
        }
        request.body[FIELDS.CONS_ID.field] = consumer[CONS_FIELDS.ID.field];
        var address = req2Domain(FIELDS, request.body, options);
        logger.debug('Address :'+JSON.stringify(address));
    }
};

module.exports.ConsumerAddress = ConsumerAddress;