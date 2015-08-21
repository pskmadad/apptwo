var $_apna = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.publishDeviceReady, false);
		document.addEventListener('online', this.publishOnline, false);
		document.addEventListener('offline', this.publishOffline, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    publishDeviceReady: function() {
		$(document).ready(function(){
			console.log('Device is ready');
			//All the files will add respective objects to apna object
			$(document).trigger('apna:initialize');
		});		
    },
	
	publishOnline: function() {
		$(document).ready(function(){
			console.log('Device is online');
			$(document).trigger('apna:online');
		});		
	},

	publishOffline: function() {
		$(document).ready(function(){
			console.log('Device is Offline');
			$(document).trigger('apna:offline');
		});		
	}
};

$_apna.initialize();

$(document).ready(function(){

	//Wait for consumer available
	var consumerReady = false;
	$(document).on('apna:ConsumerReady', function(){
		console.log('Consumer ready...');
		consumerReady = true;
		publish();
	});

	//Wait for database available
	var databaseReady = false;
	$(document).on('apna:DatabaseReady', function(){
		console.log('DB ready...');
		databaseReady = true;
		publish();
	});

    var publishNotCalled = true;
	function publish(){
		//Got all the required resources to start my application
		if(publishNotCalled && consumerReady && databaseReady){
			console.log('Apna Bag Read...');
            publishNotCalled = false;
			$(document).trigger('apna:ApnaBagReady');
		}
	}
});
