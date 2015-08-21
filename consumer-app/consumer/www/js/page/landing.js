$(document).ready(function(){
	$(document).on('apna:ApnaBagReady', execute);

	function execute(){
		var app = $_apna;
		app.consumer.hasAccount(function(err, data){
			console.log('Has account :'+data);
			if(data){
				$('#newConsumer').text('Consumer is present in our system');
			}else{
				$('#newConsumer').text('Consumer is new');
			}
		});
	}
});