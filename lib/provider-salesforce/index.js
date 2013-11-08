'use strict';
/**
 * Provider config
 */
var nForce = require("nforce");

var config = require('../../config/configuration.js');

// Create the application instance to manipulate the Salesforce API
// Optional parameter : It uses the current salesforce API in production mode
var org = nforce.createConnection({
  clientId: config.salesforce_id,
  clientSecret: config.salesforce_secret,
  redirectUri: config.salesforce_callback,
});

 
var initAccount = function(req, next) {
};

var connectAccountRetrievePreDatasIdentifier = function(req, next) {
};

var connectAccountRetrieveAuthDatas = function(req, preDatas, next) {
};

var updateAccount = function(oauthToken, cursor, next) {
};

var queueWorker = uploadFile;

module.exports = {
  initAccount: initAccount,
  connectAccountRetrievePreDatasIdentifier: connectAccountRetrievePreDatasIdentifier,
  connectAccountRetrieveAuthDatas: connectAccountRetrieveAuthDatas,
  updateAccount: updateAccount,
  queueWorker: queueWorker,

  cluestrAppId: config.cluestr_id,
  cluestrAppSecret: config.cluestr_secret,
  connectUrl: config.dropbox_connect,
  concurrency: config.max_concurrency
};