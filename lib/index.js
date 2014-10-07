'use strict';
/**
 * This object contains all the handlers to use for this provider
 */

var jsforce = require('jsforce');
var async = require('async');

var config = require('../config/configuration.js');
var retrieve = require('./helpers/retrieve.js');
var upload = require('./helpers/upload.js');

var globalConn = new jsforce.Connection({
  oauth2 : {
    clientId : config.salesforceId,
    clientSecret : config.salesforceSecret,
    redirectUri : config.providerUrl + "/init/callback"
  }
});

var redirectToService = function(callbackUrl, cb) {
  // Redirect user to provider consentment page
  cb(null, globalConn.oauth2.getAuthorizationUrl({ scope : 'api id refresh_token' }), {});
};

var retrieveTokens = function(reqParams, storedParams, cb) {
  var conn = new jsforce.Connection({
    oauth2 : {
      clientId : config.salesforceId,
      clientSecret : config.salesforceSecret,
      redirectUri : config.providerUrl + "/init/callback"
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

    console.log(conn);

    conn.sobject("User").retrieve(userInfo.id, function(err, user) {
      if(err) { 
        return cb(err); 
      }

      cb(null, user.Username, data);
    });
  });
};

var updateAccount = function(serviceData, cursor, queues, cb) {
  var conn = new jsforce.Connection({
    oauth2 : {
      clientId : config.salesforceId,
      clientSecret : config.salesforceSecret,
      redirectUri : config.providerUrl + "/init/callback"
    },
    accessToken: serviceData.accessToken,
    refreshToken: serviceData.refreshToken,
    instanceUrl: serviceData.instanceUrl
  });

  conn.on("refresh", function(accessToken) {
    serviceData.accessToken = accessToken;
  });

  async.waterfall([
    function retrieveContacts(cb) {
      retrieve(conn, cursor, 500, cb);
    },
    function addContactsToQueue(newCursor, contacts, cb) {
      contacts.forEach(function(contact) {
        contact.title = contact.identifier = serviceData.instanceUrl + "/" + contact.Id;

        if(contact.IsDeleted) {
          queues.deletion.push(contact);
        }
        else {
          queues.addition.push(contact);
        }
      });

      cb(null, newCursor, serviceData);
    }
  ], cb);
};

var additionQueueWorker = function(job, cb) {
  console.log("UPLOADING", job.task.identifier);
  upload(job.task, job.anyfetchClient, cb);
};

var deletionQueueWorker = function(job, cb) {
  console.log("DELETING", job.task.identifier);
  job.anyfetchClient.deleteDocumentByIdentifier(job.task.identifier, function(err) {
    if(err && err.toString().match(/expected 204 "No Content", got 404 "Not Found"/i)) {
      err = null;
    }

    cb(err);
  });
};

additionQueueWorker.concurrency = config.maxConcurrency;
deletionQueueWorker.concurrency = config.maxConcurrency;

module.exports = {
  connectFunctions: {
    redirectToService: redirectToService,
    retrieveTokens: retrieveTokens
  },
  updateAccount: updateAccount,
  workers: {
    addition: additionQueueWorker,
    deletion: deletionQueueWorker
  },

  config: config
};