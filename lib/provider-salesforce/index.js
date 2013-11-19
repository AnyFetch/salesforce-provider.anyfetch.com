'use strict';
/**
 * Provider config
 */

var config = require('../../config/configuration.js');
var retrieve = require('./helpers/retrieve.js');
var uploadAccount = require('./helpers/upload.js');

var org = config.salesforce_org;
 
var initAccount = function(req, next) {
  // Create the connect url and store the anyFetch code
  var redirectUrl = org.getAuthUri();
  redirectUrl += '&state=' + req.params.code;

  next(null, {code: req.params.code}, redirectUrl);
};

var connectAccountRetrievePreDatasIdentifier = function(req, next) {
  console.log('New Provider');
  if(!req.params.state) {
    return next('State parameter left out of query.');
  }

  next(null, {'datas.code': req.params.state});
};

var connectAccountRetrieveAuthDatas = function(req, preDatas, next) {
  console.log('Recieved the callback');
  org.authenticate({ code: req.params.code }, function(err, tokens){
    if (err) {
      return next('Error during Oauth token exchange: ' + err.message);
    }

    next(null, tokens);
  });
};

var updateAccount = function(tokens, cursor, next, updateDatas) {
  console.log('Update the account !');
  org.refreshToken(tokens , function(err, refreshedTokens) {
    if (err) {
      return next('Error during retrieving the new accessToken: ' + err.message);
    }

    tokens.access_token = refreshedTokens.access_token;
    
    updateDatas(tokens, function(err) {
      if (err) {
        return next(err);
      }
      
      // Retrieve all contacts since last call
      if(!cursor) {
        cursor = new Date(1970);
      }
      var newCursor = new Date();

      retrieve(tokens, cursor, next);

    });
  });
};


module.exports = {
  initAccount: initAccount,
  connectAccountRetrievePreDatasIdentifier: connectAccountRetrievePreDatasIdentifier,
  connectAccountRetrieveAuthDatas: connectAccountRetrieveAuthDatas,
  updateAccount: updateAccount,
  queueWorker: uploadAccount,

  cluestrAppId: config.cluestr_id,
  cluestrAppSecret: config.cluestr_secret,
  connectUrl: config.salesforce_connect,
  concurrency: config.max_concurrency
};