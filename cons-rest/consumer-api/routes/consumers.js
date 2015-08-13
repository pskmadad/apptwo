/**
 * Created by svaithiyanathan on 8/3/15.
 */
var express = require('express');
var router = express.Router();
var ConsumerModel = require('../models/consumerModel').Consumer;
var AddressModel = require('../models/consumerAddressModel').ConsumerAddress;
var InternalServerError = require('../lib/error').InternalServerError;
var logger = require('../lib/logger').logger;
var async = require('async');

/**
 * @api {get} /consumers/:id/savings Request to retrieve savings information for a user
 * @apiName GetConsumerSavings
 * @apiGroup Consumers
 *
 * @apiParam {Number} id Unique id to identify user
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/consumers/123/savings
 *
 */
router.get('/:id/savings', function(req, res, next) {
    res.json({test: 'success'});
});

/**
 * @api {get} /consumers/:id/orders Request to retrieve all orders made by the customer in the chronological order
 * @apiName GetConsumerOrders
 * @apiGroup Consumers
 *
 * @apiParam {Number} id Unique id to identify consumer
 * @apiParam {Number} [pageNumber=1] page number that needs to be retrieved
 * @apiParam {Number} [pageSize=10] page size that needs to be retrieved
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/consumers/123/orders
 *
 */
router.get('/:id/orders', function(req, res, next) {
    res.json({test: 'success'});
});

/**
 * @api {get} /:id Request to retrieve information about a single consumer
 * @apiName GetConsumerDetails
 * @apiGroup Consumers
 *
 * @apiParam {Number} id Unique id to identify consumer
 * @apiParam {Boolean} [details=false] Flag to retrieve full information about the customer
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/consumers/123
 *  curl -i http://localhost:3000/api/v1/consumers/123?details=true
 *
 */
router.get('/:id', function(req, res, next) {
    console.log('Data :' + req.params.id);
    var model = new ConsumerModel(req);
    model.retrieveCustomer(req.params.id, function(err, consumer) {
        logger.error(err);
        if(err) {
            next(err.hasError() ? err : InternalServerError(err));
            return;
        }
        res.json(consumer);
    });
});

router.get('/', function(req, res, next) {
    console.log('Mobile:' + req.query.mobile + ', UUID:' + req.query.uuid);
    var model = new ConsumerModel(req);
    model.retrieveCustomerByMobile({mobile: req.query.mobile, uuid: req.query.uuid, channel: req.query.channel}, function(err, consumer) {
        logger.error(err);
        if(err) {
            next(err.hasError() ? err : InternalServerError(err));
            return;
        }
        res.json(consumer);
    });
});

/**
 * @api {post} / Request to create a consumer account
 * @apiName PostConsumerDetails
 * @apiGroup Consumers
 *
 * @apiParam {String} mobileNo Mobile number of the customer
 * @apiParam {String} channel Mode of account creation, supported type ANDROID, WINDOWS, WEB, IOS, OTHERS
 * @apiParam {String} [email] email of the customer, required for web channel
 * @apiParam {String} [uuid] Unique id of the mobile, required for mobile channel
 * @apiParam {String} [createdBy="channel valued passed in"] Who is creating this account
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/consumers
 *
 */
router.post('/', function(req, res, next) {
    function handleResult(err, consumer) {
        if(err) {
            next(err.hasError() ? err : InternalServerError(err));
            return;
        }
        res.json(consumer);
    }

    function createConsumer(callback) {
        consumerModel.createCustomer(function(err, apiObj) {
            if(err) {
                return callback(err);
            }
            callback(null, apiObj);
        });
    }

    function createAddress(consumer, callback){
        var addressModel = new AddressModel(req);
        console.log('Cons Id'+consumer.id);
        addressModel.createAddress(consumer.id, function(err, address){
            if(err){
                consumer.address = {errors: err.all};
                return callback(null, consumer);
            }
            consumer.address = address;
            callback(null, consumer);
        });
        //callback(null, consumer);
    }
    var consumerModel = new ConsumerModel(req);
    async.waterfall([createConsumer, createAddress], handleResult);

});

/**
 * @api {put} /:id Request to update existing consumer account
 * @apiName PutConsumerDetails
 * @apiGroup Consumers
 *
 * @apiParam {String} channel Mode of account creation, supported type ANDROID, WINDOWS, WEB, IOS, OTHERS
 * @apiParam {String} [altMobileNo] Mobile number of the customer
 * @apiParam {String} [email] email of the customer
 * @apiParam {String} [verified] Is user verified by some mechanism
 * @apiParam {String} [updatingBy] Who is modifying this account
 * @apiParam {Date} [loggedInDate] Date and time consumer access their account
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/consumers
 *
 */
router.put('/:id', function(req, res, next) {
    var model = new ConsumerModel(req);
    model.modifyCustomer(req.params.id, function(err, consumer) {
        logger.error(err);
        if(err) {
            next(err.hasError() ? err : InternalServerError(err));
            return;
        }
        res.json(consumer);
    });
});

module.exports = router;