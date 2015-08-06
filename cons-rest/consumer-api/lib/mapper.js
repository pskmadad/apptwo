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

/*
 var db2Domain = function(dbObj){
 var keys = Object.keys(dbObj);
 var domainObj = {};
 return keys.forEach(function(e){
 domainObj[changeCase.camelCase(e)] = dbObj[e];
 });
 }
 */

var req2Domain = function(struct, req) {
    var keys = Object.keys(struct);
    var domainObj = {};
    for(var i = 0; i < keys.length; i++) {
        var reqParam = req.body[struct[keys[i]]];
        if(typeof reqParam !== 'undefined') {
            domainObj[struct[keys[i]]] = reqParam;
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
/*module.exports.db2Domain = db2Domain;*/
module.exports.req2Domain = req2Domain;