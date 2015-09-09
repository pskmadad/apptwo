/**
 * Created by svaithiyanathan on 9/5/15.
 */

$(document).ready(function() {

    var Location = {
        supported: function(callback, pincode, typ){

        }
    };

    //Add location to the global variable
    $(document).on('apna:initialize', function() {
        $_apna['location'] = Location;
        $(document).trigger('apna:LocationReady');
    });
});