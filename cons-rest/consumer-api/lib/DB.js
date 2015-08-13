/**
 * Created by svaithiyanathan on 8/5/15.
 */

var mysql = require('mysql');
var logger = require('./logger').logger;
var GenericError = require('./error').GenericError;
var Errors = require('./error').Errors;
var ERROR_CODE = 500;
var ERROR_FIELD = 'DB_ERROR';

function DbError(msg){
    logger.warn('Error  '+msg);
    return new GenericError(ERROR_CODE, ERROR_FIELD, msg);
}
var pool;
//TODO: High chance of refactoring this function to remove duplicates
function DB() {

    this.select = function(callback, query, params) {
        var errors = new Errors();
        pool.getConnection(function(err, connection) {
            if(err) {
                if(connection) {
                    connection.release();
                }
                errors.add(DbError( err));
                callback(errors, null);
                return;
            }
            function resultHandler(error, rows) {
                connection.release();
                if(error) {
                    errors.add(DbError( error));
                    callback(errors, null);
                    return;
                }
                logger.debug('Rows are :' + JSON.stringify(rows));
                callback(null, rows.length === 0 ? [
                    {}
                ] : rows);
            }

            if(typeof params === 'object') {
                query = mysql.format(query, params);
            }
            connection.query(query, resultHandler);

            onConnectionError(connection, callback);
        });
    };

    function onConnectionError(connection, callback) {
        var errors = new Errors();
        connection.on('error', function(error) {
            release(connection);
            errors.add(DbError( error));
            callback(errors, null);
        });
    }

    function release(conn) {
        if(conn) {
            conn.release();
        }
    }

    this.create = function(callback, query, data) {
        var errors = new Errors();
        pool.getConnection(function(err, connection) {

            function handleResult(error, result) {
                if(error) {
                    connection.rollback(function() {
                        errors.add(DbError( error));
                        callback(errors, null);
                    });
                } else {
                    connection.commit(function(errQuery) {
                        logger.debug('Commit executed...');
                        if(errQuery) {
                            connection.rollback(function() {
                                errors.add(DbError( errQuery));
                                callback(errors, null);
                            });
                        } else {
                            release(connection);
                            logger.debug('Record created with :' + (result.insertId ? result.insertId : result[0].insertId));
                            callback(null, result.insertId ? result.insertId : result[0].insertId);
                        }
                    });
                }

            }

            if(err || query.length !== data.length) {
                release(connection);
                errors.add(DbError(err ? err : 'Invalid Query format'));
                callback(errors, null);
            } else {
                connection.beginTransaction(function(errTxn) {
                    if(errTxn) {
                        release(connection);
                        errors.add(DbError(err));
                        callback(errors, null);
                    } else {
                        var formedQuery = '';
                        for(var i = 0; i < query.length; i++) {
                            formedQuery = formedQuery + mysql.format(query[i], data[i]) + ';';
                        }
                        console.log('FQ:'+formedQuery);
                        connection.query(formedQuery, handleResult);
                    }
                });
            }
            onConnectionError(connection, callback);
        });
    };

    this.update = function(callback, query, data) {
        var errors = new Errors();
        pool.getConnection(function(err, connection) {
            if(err) {
                if(connection) {
                    connection.release();
                }
                errors.add(DbError( err));
                callback(errors, null);
                return;
            }
            connection.query(query, data, function(error, result) {
                connection.release();
                if(error) {
                    errors.add(DbError(error));
                    callback(errors, null);
                    return;
                }
                logger.debug('Record updated are :' + result.changedRows);
                callback(null, result.changedRows);
            });

            onConnectionError(connection, callback);
        });
    };

    this.buildDynamicCondition = function(whereObj, seperator) {
        var keys = Object.keys(whereObj);
        var query = ' ';
        var values = [];
        for(var i = 0; i < keys.length; i++) {
            if(whereObj[keys[i]]) {
                if(query !== ' ') {
                    query = query + seperator;
                }
                query = query + keys[i] + '=?'
                values.push(whereObj[keys[i]]);
            }
        }
        return {query: query, values: values};
    }

}

module.exports.initialize = function(config) {
    pool = mysql.createPool({
        connectionLimit: config.db.connectionLimit,
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        debug: config.db.debug || false,
        multipleStatements: true
    });
    logger.info('Created ' + config.db.connectionLimit + ' connections');
};

module.exports.DB = DB;