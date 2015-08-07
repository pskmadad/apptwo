/**
 * Created by svaithiyanathan on 8/5/15.
 */

var mysql = require('mysql');
var logger = require('./logger').logger;

var pool;
//TODO: High chance of refactoring this function to remove duplicates
function DB() {

    this.select = function(callback, query, params) {
        pool.getConnection(function(err, connection) {
            if(err) {
                connection.release();
                logger.warn('Error while getting connection');
                callback(err, null);
                return;
            }
            function resultHandler(error, rows) {
                connection.release();
                if(error) {
                    logger.warn('Error while retrieving data');
                    callback(err, null);
                    return;
                }
                logger.debug('Rows are :' + JSON.stringify(rows));
                callback(null, rows.length === 0 ? [{}] : rows);
            }

            if(typeof params === 'object') {
                connection.query(query, params, resultHandler);
            } else {
                connection.query(query, resultHandler);
            }

            connection.on('error', function(error) {
                logger.warn('Error while retrieving data...');
                callback(err, null);
                return;
            });
        });
    };

    this.create = function(callback, query, data) {
        pool.getConnection(function(err, connection) {
            if(err) {
                connection.release();
                logger.warn('Error while getting connection for creating');
                callback(err, null);
                return;
            }
            connection.query(query, data, function(error, result) {
                connection.release();
                if(error) {
                    logger.warn('Error while creating');
                    callback(error, null);
                    return;
                }
                logger.debug('Record created with :' + result.insertId);
                callback(null, result.insertId);
            });

            connection.on('error', function(error) {
                logger.warn('Error while getting connection for creating...');
                callback(error, null);
                return;
            });
        });
    };

    this.update = function(callback, query, data) {
        pool.getConnection(function(err, connection) {
            if(err) {
                connection.release();
                logger.warn('Error while getting connection for updating');
                callback(err, null);
                return;
            }
            connection.query(query, data, function(error, result) {
                connection.release();
                if(error) {
                    logger.warn('Error while updating');
                    callback(err, null);
                    return;
                }
                logger.debug('Record updated are :' + result.changedRows);
                callback(null, result.changedRows);
            });

            connection.on('error', function(error) {
                logger.warn('Error while getting connection for updating...');
                callback(err, null);
                return;
            });
        });
    };
}

module.exports.initialize = function(config) {
    pool = mysql.createPool({
        connectionLimit: config.db.connectionLimit,
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        debug: config.db.debug || false
    });
    logger.info('Created ' + config.db.connectionLimit + ' connections');
};

module.exports.DB = DB;