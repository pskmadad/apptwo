/**
 * Created by svaithiyanathan on 8/7/15.
 */

var xorCrypt = require('xor-crypt');

function encryptKey(data){
    var keys = Object.keys(data);
    var toBeEncrypt = '';
    for(var i=0; i<keys.length; i++){
        toBeEncrypt = toBeEncrypt + keys[i] + '=' + data[keys[i]] +'|';
    }
    console.log(toBeEncrypt);
    console.log('Encrypt id' + xorCrypt(toBeEncrypt));
    return xorCrypt(toBeEncrypt);
}

function decryptKey(data){
    var decryptedData = xorCrypt(data);
    var elements = decryptedData.split('|');
    var decryptedObj = {};
    for(var i=0; i<elements.length-1; i++){
        var subElements = elements[i].split('=');
        decryptedObj[subElements[0]] = subElements[1];
    }
    return decryptedObj;
}


module.exports.encryptKey = encryptKey;
module.exports.decryptKey = decryptKey;