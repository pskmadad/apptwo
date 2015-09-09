


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
		window.location.hash = "landing";
		$.mobile.initializePage();
		
        
		$(document).on('click','#proceed',function() {
			
            var pincodes = {
                pin: $("#pCode").val(),
                codes: [],
                size: 1
            };
            var consumer = {mobile: $("#pNumber").val(), uuid: device.uuid, pincodes: pincodes, prefer: 'Y'};
            app.consumer.save(function(err, savedCons){
                console.log('Saved Cons :'+savedCons);
                navigateToProduct(savedCons);
            }, consumer);
        });
    }

    function createConsumer() {

    }

    function navigateToProduct(consumer) {
        $(document).trigger('apna:ShowProductPage', consumer);
    }
});