/**
 * Created by svaithiyanathan on 8/4/15.
 */
var express = require('express');
var router = express.Router();

router.get('/:orderid', function(req, res, next) {
    res.json({test: 'success'});
});