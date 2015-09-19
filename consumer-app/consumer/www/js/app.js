$(document).bind("mobileinit", function(){
    $.mobile.autoInitializePage = false;
});

var $_apna = {
    ready : false,
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
        $_apna.ready = true;
		$(document).ready(function(){
			
			console.log('Device is Ready...');
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

