$(document).ready(function(){

	$(document).on('apna:initialize', function(){
		$_apna['db'] = window.sqlitePlugin.openDatabase({name: "apnabagconsumer.db", createFromLocation: 1});
		
		$(document).trigger('apna:DatabaseReady');
	});


});
