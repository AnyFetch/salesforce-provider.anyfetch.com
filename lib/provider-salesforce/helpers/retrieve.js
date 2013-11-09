'use strict';
/**
 * @file Retrieve contacts for the account
 */

var config = require('../../../config/configuration.js');
var org = config.salesforce_org;

var request = require('request');
var fs = require('fs');



/**
 * Retrieve all contacts associated with this user account,
 *
 * @param {String} accessToken AccessToken to identify the account
 * @param {Date} since Retrieve contacts updated since this date
 * @param {Function} cb Callback. First parameter is the error (if any), then an array of all the contacts.
 */

var retrieveContacts = function(oauth, since, cb) {

  org.getSObjects(oauth, function(err, resp) {
    if(err) {
      console.error(err);
    } else {
      resp.sobjects.forEach(function(so) {
        console.log(so.name);
      });
    }
  });
}

module.exports = function(accessToken, since, cb) {
  retrieveContacts(accessToken, since, cb);
};