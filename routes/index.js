var url = require('url');

var express = require('express');
var _ = require('lodash');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var viewData = {url: req.protocol + '://' + req.get('host')};
    if (req.query.url && req.query.delay) {
        viewData.delayUrl = viewData.url + '/delay/' + encodeURIComponent(req.query.url) + '/for/' + req.query.delay;
    }
    res.render('index', viewData);
});

var delalay = function (req, res, next) {
    // get the delay which should be between 0 and 10 seconds
    var delay = Math.max(0, Math.min(parseInt(req.params.delay, 10), 10));

    var givenUrl = req.params.url;

    if (!givenUrl) {
        res.sendStatus(400);
        return;
    }

    var givenUrlObj = url.parse(givenUrl, true);
    var requestUrlObj = url.parse(req.url, true);

    var targetUrlObj = givenUrlObj;

    if (requestUrlObj.query) {
        targetUrlObj.search = undefined; // Set search property to null to force creation of it from the query object
        targetUrlObj.query = _.merge(targetUrlObj.query, requestUrlObj.query);
    }

    var targetUrl = url.format(targetUrlObj);
    setTimeout(function () {
        console.log('Now redirecting to ' + targetUrl);
        res.redirect(targetUrl);
    }, delay * 1000);
};

router.get('/delay/:url/for/:delay', delalay);
router.head('/delay/:url/for/:delay', delalay);

module.exports = router;
