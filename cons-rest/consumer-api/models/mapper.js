/**
 * Created by svaithiyanathan on 8/5/15.
 */

var changeCase = require('change-case');
var DB = require('../lib/DB').DB;
var logger = require('../lib/logger').logger;

var domain2DB = function(domainObj){
  var keys = Object.keys(domainObj);
  var dbObj = {};
  return keys.forEach(function(e){
    dbObj[changeCase.snakeCase(e)] = domainObj[e];
  });
};

var db2Domain = function(dbObj){
  var keys = Object.keys(dbObj);
  var domainObj = {};
  return keys.forEach(function(e){
    domainObj[changeCase.camelCase(e)] = dbObj[e];
  });
}

var req2Domain = function(table, req){
  var keys = Object.keys(allTables[table]);
  var domainObj = {};
  return keys.forEach(function(e){
    domainObj[changeCase.camelCase(e)] = req.body[changeCase.camelCase(e)];
  });
}

function populateAllTables() {
  var db = new DB();
  if(!allTables){
    logger.info('Building ALL TABLES from DB Schema.............................................');
    allTables = {};
    db.select(function(err, tableNames){
      for(i=0; i<tableNames.length; i++){
        var columns = [];
        db.select(function(error, columnNames){
          for(j=0; j<columnNames.length; j++){
            columns.push(columnNames[j]);
          }
          allTables[tableNames[i]] = columns;
        }, 'SELECT column_name FROM information_schema.columns WHERE table_schema = ?? AND table_name = ??', ['grocery', tableNames[i]]);
      }
    }, 'SELECT DISTINCT table_name FROM information_schema.columns WHERE table_schema = ??',['grocery']);
    logger.debug('Built ::::'+allTables);
  }
}

var allTables = populateAllTables();