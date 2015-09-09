$(document).ready(function() {

    //All defined queries
    var BASE_SELECT_QUERY = 'SELECT * FROM consumer';
    var SELECT_DEFAULT_CONSUMER = BASE_SELECT_QUERY + ' WHERE prefer = ?;';
    var SELECT_BY_ID = BASE_SELECT_QUERY + ' WHERE id = ?;'
    var UPDATE_PIN = 'UPDATE consumer SET pincode = ?, codes = ? WHERE id = ?';

    //Define consumer object that has all features of domain object
    var Consumer = {

        preferred: function(callback) {
            function handleError(e) {
                console.log('Error preferred ::' + JSON.stringify(e));
                callback(JSON.stringify(e, false));
            }

            $_apna.db.transaction(function(tx) {
                console.log(SELECT_DEFAULT_CONSUMER);
                tx.executeSql(SELECT_DEFAULT_CONSUMER, ['1'], function(err, res) {
                    console.log('Got ' + res.rows.length + ' consumer from DB');
                    callback(null, res.rows.length >= 1 ? true : false, res.rows.length >= 1 ? res.rows.item(0) : null);
                }, handleError);
            });
        },

        byId: function(callback, id){
            function handleError(e) {
                console.log('Error byId ::' + JSON.stringify(e));
                callback(JSON.stringify(e, false));
            }

            $_apna.db.transaction(function(tx) {
                console.log(SELECT_BY_ID);
                tx.executeSql(SELECT_BY_ID, [id], function(err, res) {
                    console.log('Got ' + res.rows.length + ' consumer from DB via id');
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
                    console.log('Created ' + res.insertId + ' consumer in DB');
                    callback(null, res.insertId);
                }, handleError);
            });
        },

        changePin: function(callback, id, newPin){
            function handleError(e) {
                console.log('Error create:' + JSON.stringify(e));
                callback(JSON.stringify(e));
            }

            $_apna.db.transaction(function(tx){
                this.byId(function(err, available, consumer){
                    if(!available || err){
                        console.log('Error :'+err);
                        callback(err);
                    }else{
                        var codes = consumer.codes || [];
                        //Check the new pin is not in the existing codes
                        var index = $.inArray(newPin, codes);
                        if(index === -1){
                            codes.push(consumer.pincodes);
                        }
                        console.log('Pushing '+codes+' to DB');
                        tx.executeSql(UPDATE_PIN, [newPin, codes, id], function(error, newConsumer){
                            console.log('Err :'+error + ' Changed pin cons :'+newConsumer);
                           callback(null, newConsumer);
                        });
                    }
                }, id);
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