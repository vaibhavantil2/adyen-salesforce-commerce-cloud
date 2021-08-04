"use strict";

var server = require('server');

var _require = require('*/cartridge/scripts/updateSavedCards'),
    updateSavedCards = _require.updateSavedCards;

server.extend(module.superModule);

var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.prepend('Show', server.middleware.https, userLoggedIn.validateLoggedIn, consentTracking.consent, function (req, res, next) {
    const cust_reviews = consentTracking.rawSample;
  updateSavedCards({
    SellerAccount: req.currentCustomer.raw
  });
  next();
});
module.exports = server.exports();
