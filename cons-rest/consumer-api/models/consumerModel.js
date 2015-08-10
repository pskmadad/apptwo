/**
 * Created by svaithiyanathan on 8/4/15.
 */

var validator = require('validator');
var Errors = require('../lib/error').Errors;
var MissingParamError = require('../lib/error').MissingParamError;
var InvalidValueError = require('../lib/error').InvalidValueError;
var InvalidSizeError = require('../lib/error').InvalidSizeError;
var NoDataFoundError = require('../lib/error').NoDataFoundError;
var req2Domain = require('../lib/mapper').req2Domain;
var db2Api = require('../lib/mapper').db2Api;
var logger = require('../lib/logger').logger;
var encryptKey = require('../util/crypto').encryptKey;
var decryptKey = require('../util/crypto').decryptKey;
var FIELDS = require('../mapper/consumerMapper').FIELDS;
var CHANNEL_TYPE = require('../mapper/consumerMapper').CHANNEL_TYPE;

var DB = require('../lib/DB').DB;
var db = new DB();

var TABLE_NAME = 'm_consumers';
var INSERT_CONSUMER = 'INSERT INTO ' + TABLE_NAME + ' SET ?';
var SELECT_CONSUMER = 'SELECT * FROM ' + TABLE_NAME + ' WHERE ';

var Consumer = function(req) {
    var request = req;
    var errors = new Errors();

    function createValidation(obj) {

        var channel = obj[FIELDS.LAST_ACCESSED_CHANNEL.mappedTo];
        //Email Validation
        if(channel === CHANNEL_TYPE.WEB && validator.isNull(obj[FIELDS.EMAIL.mappedTo])) {
            errors.add(new MissingParamError(FIELDS.EMAIL.field));
        }

        //UUID Validation
        if((channel === CHANNEL_TYPE.ANDROID || channel == CHANNEL_TYPE.IOS || channel === CHANNEL_TYPE.WINDOWS) && validator.isNull(obj[FIELDS.UUID.mappedTo])) {
            errors.add(new MissingParamError(FIELDS.UUID.field));
        }

        if(errors.hasError()) {
            throw errors;
        }
    }

    function decryptCustomerId(id) {
        if(validator.isNull(id)) {
            errors.add(new MissingParamError(FIELDS.ID.field));
            throw errors;
        }
        var decryptedId = decryptKey(id, FIELDS.ID.cryptoKey);
        if(decryptedId === undefined) {
            errors.add(new InvalidValueError(FIELDS.ID.field));
            throw errors;
        }
        return decryptedId;
    }

    this.createCustomer = function(callback) {
        var options = {error: errors, reqType: 'new', useDefault: true};
        var obj = req2Domain(FIELDS, request.body, options);
        logger.debug('Consumer :' + JSON.stringify(obj));
        //Do validation
        createValidation(obj);

        //Set create defaults
        obj[FIELDS.ATTEMPT_COUNT.mappedTo] = 0;
        obj[FIELDS.CREATED_CHANNEL.mappedTo] = obj[FIELDS.LAST_ACCESSED_CHANNEL.mappedTo];
        obj[FIELDS.CREATED_DATE.mappedTo] = obj[FIELDS.UPDATED_DATE.mappedTo];
        obj[FIELDS.CREATED_BY.mappedTo] = obj[FIELDS.UPDATED_BY.mappedTo];

        db.create(function(err, result) {
            var id = encryptKey([result, obj[FIELDS.EMAIL], obj[FIELDS.UUID], obj[FIELDS.PRIMARY_MOBILE_NO]]);
            //logger.debug(decryptKey(id));
            callback(err, encodeURIComponent(id), db2Api(FIELDS, obj));
        }, INSERT_CONSUMER, obj);
    };

    this.retrieveCustomer = function(id, callback) {

        var decryptedId = decryptCustomerId(id);
        var buildWhere = db.buildDynamicCondition(decryptedId, ' and ');

        db.select(function(err, consumer) {
            if(consumer && consumer.length === 1 && Object.keys(consumer[0]).length > 0) {
                //logger.debug('Cons:'+consumer[0]);
                consumer[0][FIELDS.ID.field] = encodeURIComponent(id);
                logger.debug(JSON.stringify(consumer[0]));
                callback(err, db2Api(FIELDS, consumer[0]));
            } else {
                errors.add(new NoDataFoundError('Consumer'));
                callback(errors);
            }
        }, SELECT_CONSUMER + buildWhere.query, buildWhere.values);
    };

    function modifyValidation(consumerReq) {
        if(!validator.isNull(consumerReq[API_MAPPER.PRIMARY_MOBILE_NO.db])) {
            errors.add(new InvalidValueError(API_MAPPER.PRIMARY_MOBILE_NO.db));
        }
        if(!validator.isNull(consumerReq[API_MAPPER.status.db])) {
            errors.add(new InvalidValueError(API_MAPPER.status.db));
        }
        if(!validator.isNull(consumerReq[API_MAPPER.UUID.db])) {
            errors.add(new InvalidValueError(API_MAPPER.UUID.db));
        }
        if(!validator.isNull(consumerReq[API_MAPPER.OVERALL_SAVE.db])) {
            errors.add(new InvalidValueError(API_MAPPER.OVERALL_SAVE.db));
        }
        //Decide the data that can be updated and do validation
        var channel = consumerReq[API_MAPPER.LAST_ACCESSED_CHANNEL.db];

        //Channel validation
        if(validator.isNull(channel)) {
            errors.add(new MissingParamError(API_MAPPER.LAST_ACCESSED_CHANNEL.api));
        } else if(!CHANNEL_TYPE.isValid(channel)) {
            errors.add(new InvalidValueError(API_MAPPER.LAST_ACCESSED_CHANNEL.api))
        }

        if(errors.hasError()) {
            throw errors;
        }
    }

    this.modifyCustomer = function(id, callback) {
        var consumerReq = req2Domain(API_MAPPER, request.body, true);
        modifyValidation(consumerReq);

        var decryptedId = decryptCustomerId(id);
        var buildWhere = db.buildDynamicCondition(decryptedId);
        var arr = buildWhere.values;
        arr.splice(0, 0, 'Test@test.com');
        console.log('Array ==========> ' + arr);
        db.update(function(err, result) {
            logger.debug('Updated ' + result);
            callback(err, db2Api(API_MAPPER, consumer[0]));
        }, 'UPDATE ' + TABLE_NAME + ' SET email=? WHERE ' + buildWhere.query, arr);

        this.retrieveCustomer(id, function(err, consumer) {
            if(err) {
                callback(err);
            } else {
                //Merge the passed in data with retrieved customer
                //Update the customer and then call the callback;

                //db.update()
            }
        });
    }
}

module.exports.Consumer = Consumer;
