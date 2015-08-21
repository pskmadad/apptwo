$(document).ready(function() {

    //All defined queries
    var BASE_SELECT_QUERY = 'SELECT * FROM consumer';
    var SELECT_DEFAULT_CONSUMER = BASE_SELECT_QUERY + ' WHERE prefer = ?;';

    //Define consumer object that has all features of domain object
    var Consumer = {

        preferred: function(callback) {
            function handleError(e) {
                console.log('Error preferred ::' + JSON.stringify(e));
                callback(JSON.stringify(e, false));
            }

            $_apna.db.transaction(function(tx) {
                console.log(SELECT_DEFAULT_CONSUMER);
                tx.executeSql(SELECT_DEFAULT_CONSUMER, ['Y'], function(tx, res) {
                    console.log('Got ' + res.rows.length + ' consumer from DB');
                    callback(null, res.rows.length >= 1 ? true : false, res.rows.length >= 1 ? res.rows.item(0) : null);
                }, handleError);
            });
        },

        all: function(callback) {
            function handleError(e) {
                console.log('Error all:' + JSON.stringify(e));
                callback(JSON.stringify(e));
            }

            $_apna.db.transaction(function(tx) {

                tx.executeSql(BASE_SELECT_QUERY, [], function(tx, res) {
                    console.log('Got ' + res.rows.length + ' consumer(s) from DB');
                    callback(null, res.rows.item);
                }, handleError);
            });
        },

        save: function(callback, consumer){

            function handleError(e) {
                console.log('Error create:' + JSON.stringify(e));
                callback(JSON.stringify(e));
            }

            function buildInsert(consumer) {
                var insertQuery = 'INSERT INTO consumer ';
                var obj = buildKeyAndValues(consumer);
                return {query : insertQuery + obj.key + ' VALUES ' + obj.value, values : obj.values};
            }

            $_apna.db.transaction(function(tx) {
                var insert = buildInsert(consumer);
                console.log(JSON.stringify(insert));
                tx.executeSql(insert.query, insert.values, function(tx, res) {
                    console.log('Got ' + res.rows.length + ' consumer(s) from DB');
                    callback(null, res.rows.item);
                }, handleError);
            });
        }
    };

    //Add consumer to the global variable
    $(document).on('apna:initialize', function() {
        $_apna['consumer'] = Consumer;
        $(document).trigger('apna:ConsumerReady');
    });

});

function buildKeyAndValues(obj){
    var keys = Object.keys(obj);
    var values = [];
    var keyStr = ' (';
    var valueStr = ' ('
    var SEPARATOR = ', ';
    for(var i=0; i<keys.length; i++){
        keyStr = keyStr + keys[i] + SEPARATOR;
        valueStr = valueStr + ' ? ,';
        values.push(obj[keys[i]]);
    }
    keyStr = keyStr.substring(0, keyStr.length-SEPARATOR.length) + ') ';
    valueStr = valueStr.substring(0, valueStr.length-1) + ') ';
    return {key : keyStr, value : valueStr, values : values};
}