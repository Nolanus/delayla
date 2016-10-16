var express = require('express');
var url = require('url');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var viewData = {url: req.protocol + '://' + req.get('host')};
    if (req.query.url && req.query.delay) {
        viewData.delayUrl = viewData.url + '/delay/' + encodeURIComponent(req.query.url) + '/for/' + req.query.delay;
    }
    res.render('index', viewData);
});

/* GET Delay endpoint */
router.get('/:url/for/:delay', function (req, res, next) {
    // get the delay which should be between 0 and 10 seconds
    var delay = Math.max(0, Math.min(parseInt(req.params.delay, 10), 10));

    var targetUrl = req.params.url;

    var url_parts = url.parse(req.url, false);
    if (url_parts.query) {
        targetUrl += '?' + url_parts.query;
    }

    setTimeout(function () {
        console.log('Now redirecting to ' + targetUrl);
        res.redirect(targetUrl);
    }, delay * 1000);
});

module.exports = router;
