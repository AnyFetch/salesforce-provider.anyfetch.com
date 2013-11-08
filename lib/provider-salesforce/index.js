'use strict';
/**
 * Provider config
 */

var config = require('../../config/configuration.js');
var org = config.salesforce_org;
 
var initAccount = function(req, next) {
  // Create the connect url and store the anyFetch code
  var redirectUrl = org.getAuthUri();
  redirectUrl += '&state=' + req.params.code;

  next(null, {code: req.params.code}, redirectUrl);
};

var connectAccountRetrievePreDatasIdentifier = function(req, next) {
  if(!req.params.state) {
    return next("State parameter left out of query.");
  }

  next(null, {'datas.code': req.params.state});
};

var connectAccountRetrieveAuthDatas = function(req, preDatas, next) {
};

var updateAccount = function(oauthToken, cursor, next) {
};

var queueWorker = [];

module.exports = {
  initAccount: initAccount,
  connectAccountRetrievePreDatasIdentifier: connectAccountRetrievePreDatasIdentifier,
  connectAccountRetrieveAuthDatas: connectAccountRetrieveAuthDatas,
  updateAccount: updateAccount,
  queueWorker: queueWorker,

  cluestrAppId: config.cluestr_id,
  cluestrAppSecret: config.cluestr_secret,
  connectUrl: config.salesforce_connect,
  concurrency: config.max_concurrency
};