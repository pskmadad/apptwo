/**
 * Created by svaithiyanathan on 8/30/15.
 */
$(document).ready(function() {

    var Product = {
        byCategory: function(callback, pincode, category){

        },

        search: function(callback, pincode, name){

        },

        categories: function(callback){

        }
    };
    //Add product to the global variable
    $(document).on('apna:initialize', function() {
        $_apna['product'] = Product;
        $(document).trigger('apna:ProductReady');
    });
});