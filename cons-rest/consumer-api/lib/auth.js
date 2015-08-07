/**
 * Created by svaithiyanathan on 8/7/15.
 */

var xorCrypt = require('xor-crypt');

module.exports.ensureAuthentication = function(req, res, next){
    function isInvalid(data) {
        return xorCrypt(data, req.config.salt) !== req.config.decrypted;
    }

    if(typeof req.header('X_APP_ORIGIN') === 'undefined' || isInvalid(req.header('X_APP_ORIGIN'))) {
        res.render('error', {
            message: 'Unauthorized access',
            stack: 'Unable to access this ' + req.originalUrl,
            status: 401
        });
        return;
    } else {
        next();
    }
}