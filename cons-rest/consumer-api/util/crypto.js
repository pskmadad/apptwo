/**
 * Created by svaithiyanathan on 8/7/15.
 */

var xorCrypt = require('xor-crypt');
var logger = require('../lib/logger').logger;

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
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
}

function encryptKey(data) {
    var keys = Object.keys(data);
    var toBeEncrypt = '';
    for(var i = 0; i < keys.length; i++) {
        toBeEncrypt = toBeEncrypt + keys[i] + '!=!' + (data[keys[i]] || ' ') + '!|!';
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
    var decryptedObj = {};
    var collectedArr = [];
    for(var i = 0; i < elements.length - 1; i++) {
        var subElements = elements[i].split('!=!');
        if(subElements.length === 2) {
            if(subElements !== ' '){
                decryptedObj[subElements[0]] = subElements[1];
            }
            collectedArr.push(subElements[0]);
        }
    }
    logger.debug(decryptedObj);
    logger.debug(collectedArr + ':'+ struct);
    if(struct && !struct.equals(collectedArr)) {
        return undefined;
    }
    return decryptedObj;
}

module.exports.encryptKey = encryptKey;
module.exports.decryptKey = decryptKey;