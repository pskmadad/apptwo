/**
 * Created by svaithiyanathan on 8/7/15.
 */

var xorCrypt = require('xor-crypt');
var logger = require('../lib/logger').logger;

// attach the .equals method to Array's prototype to call it on any array
/*Array.prototype.equals = function(array) {
 // if the other array is a falsy value, return
 if(!array) {
 return false;
 }

 // compare lengths - can save a lot of time
 if(this.length != array.length) {
 return false;
 }

 for(var i = 0, l = this.length; i < l; i++) {
 // Check if we have nested arrays
 if(this[i] instanceof Array && array[i] instanceof Array) {
 // recurse into the nested arrays
 if(!this[i].equals(array[i])) {
 return false;
 }
 } else if(this[i] != array[i]) {
 // Warning - two different object instances will never be equal: {x:20} != {x:20}
 return false;
 }
 }
 return true;
 }*/

function encryptKey(data) {
    var toBeEncrypt = '';
    for(var i = 0; i < data.length; i++) {
        toBeEncrypt = toBeEncrypt + (data[i] || ' ') + '!|!';
    }
    logger.debug(toBeEncrypt);
    logger.debug('Encrypt id' + xorCrypt(toBeEncrypt));
    return xorCrypt(toBeEncrypt);
}

function decryptKey(data, struct) {
    logger.debug(data);
    var decryptedData = xorCrypt(data);
    logger.debug(decryptedData);
    var elements = decryptedData.split('!|!');
    logger.debug('Struct Len:'+struct.length+' : '+(elements.length-1));
    if(struct.length !== elements.length - 1) {
        return undefined;
    }
    var decryptedObj = {};
    for(var i = 0; i < elements.length - 1; i++) {
        if(elements[i] !== ' ') {
            decryptedObj[struct[i]] = elements[i];
        }
    }
    logger.debug('Decrypt Obj:'+JSON.stringify(decryptedObj));

    return decryptedObj;
}

module.exports.encryptKey = encryptKey;
module.exports.decryptKey = decryptKey;