/**
 * Created by svaithiyanathan on 8/4/15.
 */

var validator = require('validator');
var Errors = require('../lib/error').Errors;
var MissingParamError = require('../lib/error').MissingParamError;
var InvalidValueError = require('../lib/error').InvalidValueError;
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
        }
        var decryptedId = decryptKey(id, FIELDS.ID.cryptoKey);
        console.log(decryptedId[FIELDS.EMAIL.mappedTo] + ':'+decryptedId[FIELDS.PRIMARY_MOBILE_NO.mappedTo]+':'+decryptedId[FIELDS.UUID.mappedTo]);
        if(decryptedId === undefined ||
          (!decryptedId[FIELDS.EMAIL.mappedTo] && !decryptedId[FIELDS.PRIMARY_MOBILE_NO.mappedTo] && !decryptedId[FIELDS.UUID.mappedTo])) {
            errors.add(new InvalidValueError(FIELDS.ID.field));
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
            var id = encryptKey([result, obj[FIELDS.EMAIL.mappedTo], obj[FIELDS.UUID.mappedTo], obj[FIELDS.PRIMARY_MOBILE_NO.mappedTo]]);
            //logger.debug(decryptKey(id));
            callback(err, encodeURIComponent(id), db2Api(FIELDS, obj));
        }, INSERT_CONSUMER, obj);
    };

    this.retrieveCustomer = function(id, callback) {

        var decryptedId = decryptCustomerId(id);
        if(errors.hasError()){
            callback(errors);
            return;
        }
        var buildWhere = db.buildDynamicCondition(decryptedId, ' and ');

        db.select(function(err, consumer) {
            if(consumer && consumer.length === 1 && Object.keys(consumer[0]).length > 0) {
                var fetchedConsumer = consumer[0];
                //logger.debug('Cons:'+consumer[0]);
                fetchedConsumer[FIELDS.ID.field] = encodeURIComponent(encryptKey([fetchedConsumer[FIELDS.ID.mappedTo],
                    fetchedConsumer[FIELDS.EMAIL.mappedTo], fetchedConsumer[FIELDS.UUID.mappedTo], fetchedConsumer[FIELDS.PRIMARY_MOBILE_NO.mappedTo]]));
                logger.debug(JSON.stringify(fetchedConsumer));
                callback(err, db2Api(FIELDS, fetchedConsumer));
            } else {
                errors.add(new NoDataFoundError('Consumer'));
                callback(errors);
            }
        }, SELECT_CONSUMER + buildWhere.query, buildWhere.values);
    };

    this.modifyCustomer = function(id, callback) {
        var that = this;
        logger.debug('Id to be modified :'+id);
        var options = {error: errors, reqType: 'edit', useDefault: false};
        var consumerReq = req2Domain(FIELDS, request.body, options);
        logger.debug('Updating consumer :'+ JSON.stringify(consumerReq));

        var decryptedId = decryptCustomerId(id);
        if(errors.hasError()){
            logger.info('Consumer has error '+consumerReq);
            callback(errors);
        }
        logger.debug('Decrypted Key :'+JSON.stringify(decryptedId));
        var buildWhere = db.buildDynamicCondition(decryptedId, ' and ');
        var setPart = db.buildDynamicCondition(consumerReq, ' , ');
        setPart.values.splice(setPart.values.length, 0, buildWhere.values);
        console.log('Array ==========> ' + setPart.values);
        db.update(function(err, updatedConsumer) {
            logger.debug('Updated ' + updatedConsumer);
            if(err){
                callback(err);
                return;
            }
            that.retrieveCustomer(id, callback);
        }, 'UPDATE ' + TABLE_NAME + ' SET ' + setPart.query + ' WHERE ' + buildWhere.query, setPart.values);
    }
}

module.exports.Consumer = Consumer;
