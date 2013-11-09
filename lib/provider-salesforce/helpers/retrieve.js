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
    if (err) {
      return next("Error during getting the columns: " + err.message);
    };

    for (var index in res.fields) {
      columns.push(res.fields[index].name);
    };

    cb(null, columns.join(', '));
  });
}

var retrieveObjects = function(oauth, objectType, cb) {
  getColumns(oauth, objectType, function(err, columns){
    if (err) {
      return next("Error during getting the objects: " + err.message);
    };

    var q = 'SELECT ' + columns + ' FROM '+ objectType;

    org.query(q, oauth, function(err, res) {
      cb(null, res.records);
    });
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
  retrieveObjects(oauth, 'Contact', function(err, objects) {
    cb(null, objects);
  });
}

module.exports = function(accessToken, since, cb) {
  retrieveContacts(accessToken, since, cb);
};