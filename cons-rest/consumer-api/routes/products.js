/**
 * Created by svaithiyanathan on 8/3/15.
 */

var express = require('express');
var router = express.Router();

/**
 * @api {get} /products/predefinedList Request all available product information based on defined list in the system
 * @apiName GetPredefinedProductList
 * @apiGroup Products
 *
 * @apiParam {String} [type=SOUTH_INDIAN] Type of the list, supported types are SOUTH_INDIAN, NORTH_INDIAN
 *
 * @apiSampleRequest /products/predefinedList
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/products/predefinedList?type=SOUTH_INDIAN
 *
 */
router.get('/predefinedList', function(req, res, next) {

    res.json({test:'success'});
});

/**
 * @api {get} /products Request all available product information based on increasing chronological order
 * @apiName GetProducts
 * @apiGroup Products
 *
 * @apiParam {Date} [lastFetchedDate=15-07-2015] Request all products above this date
 * @apiParam {Number} [pageNumber=1] page number that needs to be retrieved
 * @apiParam {Number} [pageSize=50] page size that needs to be retrieved
 *
 * @apiSampleRequest /products
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:3000/api/v1/products?lastFetchedDate=15-07-2015
 *
 */
router.get('/', function(req, res, next) {
    res.json({test:'success'});
});

module.exports = router;