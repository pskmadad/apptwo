/**
 * Created by svaithiyanathan on 9/18/15.
 */
$(document).ready(function() {
    console.log('Doc ready in loadObject');
    $.getScript('js/mock/configMock.js').done(function() {
        console.log('Mock config loaded');
        var path = 'domain';
        if(mock.isMock) {
            path = 'mock'
        } else {
            //Load all common objects
            $.getScript('js/common/database.js');
        }
        console.log('Path :'+path);
        //Load all domain objects or mock objects
        $.getScript('js/' + path + '/consumer.js').fail(function(jqxhr, settings, exception) {
            $.getScript('js/domain/consumer.js')
        });
        $.getScript('js/' + path + '/location.js').fail(function(jqxhr, settings, exception) {
            $.getScript('js/domain/location.js')
        });
        $.getScript('js/' + path + '/product.js').fail(function(jqxhr, settings, exception) {
            $.getScript('js/domain/product.js')
        });
        console.log('Mock.isMock:'+mock.isMock);
        if(mock.isMock) {
            console.log('Mock is running..... Please turn off mock @ /js/mock/configMock.js, property: isMock : false');
            setTimeout(function (){$(document).trigger('apna:ApnaBagReady');}, 500);
        } else {
            //Wait for consumer available
            var consumerReady = false;
            $(document).on('apna:ConsumerReady', function() {
                console.log('Consumer ready...');
                consumerReady = true;
                publish();
            });

            //Wait for database available
            var databaseReady = false;
            $(document).on('apna:DatabaseReady', function() {
                console.log('DB ready...');
                databaseReady = true;
                publish();
            });

            var publishNotCalled = true;

            function publish() {
                //Got all the required resources to start my application
                if(publishNotCalled && consumerReady && databaseReady) {
                    console.log('Apna Bag Read...22');
                    publishNotCalled = false;
                    $(document).trigger('apna:ApnaBagReady');
                }
            }
        }
    }).fail(function( jqxhr, settings, exception ) {
          console.log( "Triggered ajaxError handler."+ exception);
      });
});