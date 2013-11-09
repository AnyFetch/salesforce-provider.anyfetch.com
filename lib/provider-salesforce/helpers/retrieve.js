'use strict';
/**
 * @file Retrieve contacts for the account
 */

var config = require('../../../config/configuration.js');
var org = config.salesforce_org;

var request = require('request');
var fs = require('fs');

var getColumns = function(oauth, objectType, cb) {
  var columns = [];

  org.getDescribe(objectType, oauth, function(err, res) {
    for (var index in res.fields) {
      columns.push(res.fields[index].name);
    };

    cb(null, columns.join(', '));
  });
}

/**
 * Retrieve all contacts associated with this user account,
 *
 * @param {String} accessToken AccessToken to identify the account
 * @param {Date} since Retrieve contacts updated since this date
 * @param {Function} cb Callback. First parameter is the error (if any), then an array of all the contacts.
 */

var retrieveContacts = function(oauth, since, cb) {
  getColumns(oauth, 'Contact', function(err, columns){
    var q = 'SELECT ' + columns + ' FROM Contact';
    org.query(q, oauth, function(err, res) {
      console.log(JSON.stringify(res));
    });
  });
}

module.exports = function(accessToken, since, cb) {
  retrieveContacts(accessToken, since, cb);
};