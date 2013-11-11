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
  console.log(oauth);

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

    var q = 'Select Id, Name, BodyLength From Attachment';

    org.query(q, oauth, function(err, res) {
      console.log(JSON.stringify(res))
      cb(null, res.records);
    });
  });
}


var retrieveContacts = function(oauth, since, cb) {
  retrieveObjects(oauth, 'Contact', function(err, objects) {
    cb(null, objects, new Date());
  });
}

module.exports = retrieveContacts;