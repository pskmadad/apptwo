
$(document).ready(function() {

    //Search in local variable will be faster
    var app;

    $(document).on('apna:ApnaBagReady', initialize);
	console.log($.mobile.autoInitializePage );
	
	
    function initialize() {
		
		alert("initialize");
        app = $_apna;
		splashPage();
    }
	
	function splashPage(){
		
		$(function() {
			setTimeout(determinePage, 2000);
		});
	}
	

    function determinePage() {
		alert("determinePage");
        app.consumer.preferred(function(err, hasAccount, consumer) {
            console.log('Has account :' + JSON.stringify(consumer));
            hasAccount ? navigateToProduct(consumer) : showLanding();
        });
    }

    function showLanding() {
		$.mobile.initializePage();
		
		$('.ui-slider').width(180);
        
        $('#proceed').click(function() {
			var mobileNumber = $("#phoneNumber").val();
			var pincode = $("#pincode").val();
            var pincodes = {
                pin: pincode,
                codes: [],
                size: 1
            };
            //var consumer = {mobile: Math.round(Math.random() * 10000000000), uuid: device.uuid, pincodes: pincodes, prefer: 'Y'};
			var consumer = {mobile: mobileNumber, uuid: device.uuid, pincodes: pincodes, prefer: 'Y'};
            app.consumer.save(function(err, savedCons){
                console.log('Saved Cons :'+savedCons);
                navigateToProduct(savedCons);
            }, consumer);
        });
    }


    function navigateToProduct(consumer) {
        $('#newConsumer').text('Consumer is present in our system');
		 $.mobile.changePage( "#productList", { transition: "none"} ); 
       // $(document).trigger('apna:ShowProductPage', consumer);
    }
});