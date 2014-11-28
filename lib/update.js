'use strict';

var jsforce = require('jsforce');
var async = require('async');

var config = require('../config/configuration.js');
var retrieve = require('./helpers/retrieve.js');

module.exports = function updateAccount(serviceData, cursor, queues, cb) {
  var conn = new jsforce.Connection({
    oauth2: {
      clientId: config.salesforceId,
      clientSecret: config.salesforceSecret,
      redirectUri: config.providerUrl + "/init/callback"
    },
    accessToken: serviceData.accessToken,
    refreshToken: serviceData.refreshToken,
    instanceUrl: serviceData.instanceUrl
  });

  async.waterfall([
    function retrieveContacts(cb) {
      retrieve(conn, cursor, 500, cb);
    },
    function addContactsToQueue(newCursor, contacts, cb) {
      contacts.forEach(function(contact) {
        contact.title = contact.identifier = serviceData.instanceUrl + "/" + contact.Id;

        if(contact.IsDeleted) {
          if(cursor) {
            queues.deletion.push(contact);
          }
        }
        else {
          queues.addition.push(contact);
        }
      });

      serviceData.accessToken = conn.accessToken;
      cb(null, newCursor, serviceData);
    }
  ], cb);
};
