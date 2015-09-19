/**
 * Created by svaithiyanathan on 9/14/15.
 */
$(document).ready(function() {

    var Consumer = {

        preferred: function(callback) {
            callback(null, mock.customerAvailable , mock.consumer);
        },

        byId: function(callback, id){
            callback(null, mock.customerAvailable, mock.consumer);
        },

        all: function(callback) {
            callback(null, [mock.consumer]);
        },

        save: function(callback, consumer){
            callback(null, 1);
        },

        changePin: function(callback, id, newPin){
            var newConsumer = mock.consumer;
            newConsumer.codes.push(mock.consumer.pincode);
            newConsumer.pincode = newPin;
            callback(null, newConsumer);
        }
    };

    $_apna['consumer'] = Consumer;
});