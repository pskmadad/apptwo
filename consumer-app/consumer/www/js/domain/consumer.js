$(document).ready(function(){

	var Consumer = 	{
		hasAccount : function(callback){
			$_apna.db.transaction(function(tx) {
				tx.executeSql("SELECT COUNT(id) as available FROM consumer;", [], function(tx, res) {
					console.log('Got '+res.rows.length+' consumer(s) from DB');
					callback(null, res.rows.item(0).available);
				}, function(e){
					console.log('Error :'+JSON.stringify(e));
					callback(JSON.stringify(e));
				});
			});
		}
	};

	$(document).on('apna:initialize', function(){
		$_apna['consumer'] = Consumer;
		
		$(document).trigger('apna:ConsumerReady');
	});

});
