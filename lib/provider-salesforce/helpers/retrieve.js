'use strict';
/**
 * @file Retrieve contacts for the account
 */

var config = require('../../../config/configuration.js');
var org = config.salesforce_org;

var request = require('request');
var async = require('async');
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

    if (objectType == "Contact") {
      columns.push('Account.name');
    };

    cb(null, columns.join(', '));
  });
}

var retrieveFromType = function(oauth, type, cb) {
  getColumns(oauth, type, function(err, columns) {
    if (err) {return cb(err)};

    var q = 'Select '+ columns +' From ' + type;

    org.query(q, oauth, function(err, res) {
      if (err) {return cb(err)};

      cb(null, res.records);
    });
  });
}

var retrieveAttachements = function(oauth, cb) {
  var q = 'Select Id, Name, BodyLength From Attachment';

  org.query(q, oauth, function(err, res) {
    if (err) {
      return cb(err);
    }

    cb(null, res.records);
  });
}


module.exports = function(oauth, since, cb) {
  console.log("Retrieve");
  var tasks = [];
  
  async.parallel([
    function(cb) {
      retrieveAttachements(oauth, cb)
    },
    function(cb) {
      retrieveFromType(oauth, 'Contact', cb)
    },
    function(cb) {
      retrieveFromType(oauth, 'Lead', cb)
    }
  ], function(err, res) {
    tasks = res[0].concat(res[1], res[2]);
    cb(null, tasks, new Date());
  });
}