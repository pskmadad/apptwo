/**
 * Created by svaithiyanathan on 8/5/15.
 */

var logger = require('./logger').logger;

/*var domain2DB = function(domainObj){
 var keys = Object.keys(domainObj);
 var dbObj = {};
 return keys.forEach(function(e){
 dbObj[changeCase.snakeCase(e)] = domainObj[e];
 });
 };*/

var db2Api = function(struct, dbObj) {
    var keys = Object.keys(struct);
    var domainObj = {};
    for(var i = 0; i < keys.length; i++) {
        var field = struct[keys[i]];
        //logger.debug('Db2API :'+dbObj[field.db]);
        //Check field is object & need to show in api as well as value is available
        if(typeof field === 'object' && field.show && typeof dbObj[field.db] !== 'undefined' && dbObj[field.db] !== null) {
            domainObj[field.api || field.db] = dbObj[field.db];
        } else if(typeof dbObj[field] !== 'undefined' && dbObj[field] !== null){
            //Check value is available before adding it
            domainObj[field] = dbObj[field];
        }
    }
    return domainObj;
}

var req2Domain = function(struct, body, useDefault) {
    var keys = Object.keys(struct);
    var domainObj = {};
    for(var i = 0; i < keys.length; i++) {
        var field = struct[keys[i]];
        //logger.debug(field);

        var reqParam = body[field.api || field.db || field] || (useDefault ? field.default : undefined);
        //logger.debug(reqParam)
        if(typeof reqParam !== 'undefined') {
            domainObj[field.db || field] = reqParam;
        }
    }
    return domainObj;
}

/*
 function initialize(config) {
 if(!allTables){
 logger.info('Building ALL TABLES from DB Schema.............................................');
 allTables = {};
 db.select(function(err, tableNames){
 for(var i=0; i<tableNames.length; i++){
 db.select(function(error, columnTableNames){
 var columns = [];
 for(var j=0; j<columnTableNames.length; j++){
 columns.push(columnTableNames[j]['column_name']);
 }
 allTables[columnTableNames[0]['table_name']] = columns;
 console.log(allTables);
 }, 'SELECT column_name, table_name FROM information_schema.columns WHERE table_schema = ? AND table_name = ?', [config.db.database, tableNames[i]['table_name']]);
 }
 }, 'SELECT DISTINCT table_name FROM information_schema.columns WHERE table_schema = ?',[config.db.database]);
 }
 }

 var allTables;

 module.exports.initialize = initialize;
 */
/*module.exports.domain2DB = domain2DB;*/
module.exports.db2Api = db2Api;
module.exports.req2Domain = req2Domain;