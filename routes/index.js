const url = require('url');

const express = require('express');
const debug = require('debug')('delayla:server');
const _ = require('lodash');

const router = express.Router();

// GET home page.
router.get('/', (req, res) => {
  const viewData = { url: `${req.protocol}://${req.get('host')}` };
  if (req.query.url && req.query.delay) {
    viewData.delayUrl = `${viewData.url}/delay/${encodeURIComponent(req.query.url)}/for/${req.query.delay}`;
  }
  res.render('index', viewData);
});

const delalay = (req, res) => {
  // get the delay which should be between 0 and 10 seconds
  const delay = Math.max(0, Math.min(parseInt(req.params.delay, 10), 10));

  const givenUrl = req.params.url;

  if (!givenUrl) {
    res.sendStatus(400);
    return;
  }

  const givenUrlObj = url.parse(givenUrl, true);
  const requestUrlObj = url.parse(req.url, true);

  const targetUrlObj = givenUrlObj;

  if (requestUrlObj.query) {
    // Set search property to null to force creation of it from the query object
    targetUrlObj.search = undefined;
    targetUrlObj.query = _.merge(targetUrlObj.query, requestUrlObj.query);
  }

  const targetUrl = url.format(targetUrlObj);
  setTimeout(() => {
    debug(`Now redirecting to ${targetUrl}`);
    res.redirect(targetUrl);
  }, delay * 1000);
};

router.get('/delay/:url/for/:delay', delalay);
router.head('/delay/:url/for/:delay', delalay);

module.exports = router;
