/**
 * Created by svaithiyanathan on 8/5/15.
 */

var logger = require('./logger').logger;
var _ = require('underscore');

var db2Api = function(struct, dbObj) {
    var keys = Object.keys(struct);
    var domainObj = {};
    logger.debug('DB :' + JSON.stringify(dbObj));
    for(var i = 0; i < keys.length; i++) {
        var field = struct[keys[i]];
        //logger.debug('Field:'+JSON.stringify(field));
        //Check field is object & need to show in api as well as value is available
        if(!field.hideToApi && typeof dbObj[field.mappedTo] !== 'undefined' && dbObj[field.mappedTo] !== null) {
            domainObj[field.field] = dbObj[field.mappedTo];
        }
    }
    return domainObj;
}

var req2Domain = function(struct, body, options) {
    //console.log('Step 1');
    var keys = Object.keys(struct);
    //console.log('Step 2');
    var domainObj = {};

    body = options.prefix ? body[options.prefix] : body;
    if(!body){
        return domainObj;
    }

    console.log('Prefix Body :'+ JSON.stringify(body));
    for(var i = 0; i < keys.length; i++) {
        var element = struct[keys[i]];
        //logger.debug(element.field);

        var reqParam = body[element.field];
        var validations = element.validation || [];
        for(var j = 0; j < validations.length; j++) {
            //console.log('-->'+ element.field +':'+reqParam);
            validations[j](options.error, element.field, reqParam, options.reqType);
        }

        if(typeof reqParam === 'undefined') {
            reqParam = options.useDefault ? element.default : undefined;
        }
        //logger.debug(reqParam)
        if(typeof reqParam !== 'undefined') {
            domainObj[element.mappedTo] = reqParam;
        }
    }
    console.log('Req 2 DB done');
    return domainObj;
}

var mergeFields = function(DB_PARAMS, API_PARAMS) {
    var FINAL_FIELDS = {};
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

module.exports.db2Api = db2Api;
module.exports.req2Domain = req2Domain;
module.exports.mergeFields = mergeFields;