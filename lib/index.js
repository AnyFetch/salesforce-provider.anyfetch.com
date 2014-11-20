'use strict';
/**
 * This object contains all the handlers to use for this provider
 */

var jsforce = require('jsforce');
var CancelError = require('anyfetch-provider').CancelError;

var config = require('../config/configuration.js');

var globalConn = new jsforce.Connection({
  oauth2: {
    clientId: config.salesforceId,
    clientSecret: config.salesforceSecret,
    redirectUri: config.providerUrl + "/init/callback"
  }
});

var redirectToService = function(callbackUrl, cb) {
  // Redirect user to provider consentment page
  cb(null, globalConn.oauth2.getAuthorizationUrl({
    scope: 'api id refresh_token',
    prompt: 'consent'
  }), {});
};

var retrieveTokens = function(reqParams, storedParams, cb) {
  if(reqParams.error === "access_denied") {
    return cb(new CancelError());
  }

  var conn = new jsforce.Connection({
    oauth2: {
      clientId: config.salesforceId,
      clientSecret: config.salesforceSecret,
      redirectUri: config.providerUrl + "/init/callback"
    }
  });

  conn.authorize(reqParams.code, function(err, userInfo) {
    if(err) {
      return cb(err);
    }

    var data = {
      accessToken: conn.accessToken,
      refreshToken: conn.refreshToken,
      instanceUrl: conn.instanceUrl
    };

    conn.sobject("User").retrieve(userInfo.id, function(err, user) {
      if(err) {
        return cb(err);
      }

      cb(null, user.Username, data);
    });
  });
};

module.exports = {
  connectFunctions: {
    redirectToService: redirectToService,
    retrieveTokens: retrieveTokens
  },

  config: config
};
