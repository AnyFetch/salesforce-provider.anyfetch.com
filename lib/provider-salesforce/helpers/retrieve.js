'use strict';
/**
 * @file Retrieve contacts for the account
 */

var config = require('../../../config/configuration.js');
var request = require('request');


/**
 * Retrieve all contacts associated with this user account,
 *
 * @param {String} accessToken AccessToken to identify the account
 * @param {Date} since Retrieve contacts updated since this date
 * @param {Function} cb Callback. First parameter is the error (if any), then an array of all the contacts.
 */

var retrieveContacts = function(accessToken, since, cb) {
  console.log(accessToken);
}

module.exports = function(accessToken, since, cb) {
  retrieveContacts(accessToken, since, cb);
};