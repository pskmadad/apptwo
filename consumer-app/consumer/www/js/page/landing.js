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
        $('#newConsumer').text('Consumer is new');
        $('#newConsumer').click(function() {
            var pincodes = {
                pin: '603103',
                codes: [],
                size: 1
            };
            var consumer = {mobile: Math.round(Math.random() * 10000000000), uuid: 'ABBC', pincodes: pincodes, prefer: 'Y'};
            app.consumer.save(function(err, savedCons){
                console.log('Saved Cons :'+savedCons);
                navigateToProduct(savedCons);
            }, consumer);
        });
    }

    function createConsumer() {

    }

    function navigateToProduct(consumer) {
        $('#newConsumer').text('Consumer is present in our system');
        $(document).trigger('apna:ShowProductPage', consumer);
    }
});