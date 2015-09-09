


$(document).ready(function() {

    //Search in local variable will be faster
    var app;

    $(document).on('apna:ApnaBagReady', initialize);

    function initialize() {	
        app = $_apna;
		determinePage();

    }

    function determinePage() {
		
        app.consumer.preferred(function(err, hasAccount, consumer) {
            console.log('Has account :' + JSON.stringify(consumer));
            hasAccount ? navigateToProduct(consumer) : showLanding();
        });
    }

    function showLanding() {
		//window.location.hash = "landing";
		//$.mobile.initializePage();
		
        
		$(document).on('click','#proceed',function() {

            var consumer = {mobile: $("#pNumber").val(), uuid: device.uuid, pincode: $("#pCode").val(), prefer: '1'};
            app.consumer.save(function(err, savedCons){
                console.log('Saved Cons :'+savedCons);
                if(err){
                    return false;
                }else{
                    navigateToProduct(savedCons);
                }
            }, consumer);
        });
    }

    function createConsumer() {

    }

    function navigateToProduct(consumer) {
        $(document).trigger('apna:ShowProductPage', consumer);
    }
});