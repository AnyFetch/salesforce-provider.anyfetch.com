'use strict';
/**
 * @file Retrieve contacts for the account
 */

var config = require('../../../config/configuration.js');
var org = config.salesforce_org;

var async = require('async');


var getColumns = function(oauth, objectType, cb) {
  var columns = [];

  org.getDescribe(objectType, oauth, function(err, res) {
    if (err) {
      return cb(err);
    }

    for (var index in res.fields) {
      columns.push(res.fields[index].name);
    }

    if (objectType === 'Contact') {
      columns.push('Account.name');
    }

    cb(null, columns.join(', '));
  });
};

var retrieveFromType = function(oauth, type, cb) {
  getColumns(oauth, type, function(err, columns) {
    if (err) {
      return cb(err);
    }

    var q = 'Select '+ columns +' From ' + type;

    org.query(q, oauth, function(err, res) {
      if (err) {
        return cb(err);
      }
      cb(null, res.records);
    });
  });
};

var mapReleadElementObjects = function(contactId, releatedRecord, cb) {
  // Formattable Types
  var releatedObjectsTypes = ['Events', 'Notes', 'Tasks'];
  var formattedReleadted = [];

  releatedObjectsTypes.forEach(function(type) {

    if (releatedRecord[type] !== null) {
      releatedRecord[type].records.forEach(function(realeatedObject) {
        realeatedObject.ReleatedParentId = contactId;
        formattedReleadted.push(realeatedObject);
      });
    }

  });

  cb(null, formattedReleadted);
};

var getReleatedElement = function(oauth, cb) {
  var q = 'SELECT Id,  (SELECT Subject, Description, StartDateTime, EndDateTime FROM Events), ';
    q += '(SELECT Title, Body FROM Notes), ';
    q += '(SELECT Id, BodyLength, Name, Description FROM Attachments), ';
    q += '(SELECT Subject, Status, ActivityDate, Description FROM Tasks) ';
    q += 'FROM Contact';

  org.query(q, oauth, function(err, res) {
    if (err) {
      return cb(err);
    }

    var tasks = [];
    res.records.forEach( function(record) {
      var contactId = record.Id;
      mapReleadElementObjects(contactId, record, function(err, res) {
        tasks = tasks.concat(res);
      });
    });

    cb(null, tasks);
  });
};

var retrieveAttachements = function(oauth, cb) {
  var q = 'Select Id, Name, BodyLength, CreatedDate From Attachment';

  org.query(q, oauth, function(err, res) {
    if (err) {
      return cb(err);
    }

    cb(null, res.records);
  });
};


module.exports = function(oauth, since, cb) {
  console.log('Retrieve');
  var tasks = [];
  
  async.parallel([
    async.apply(retrieveAttachements, oauth),
    async.apply(getReleatedElement, oauth),
    async.apply(retrieveFromType, oauth, 'Contact'),
    async.apply(retrieveFromType, oauth, 'Lead'),
  ], function(err, res) {

    tasks = [];
    for(var index in res) {
      tasks = tasks.concat(res[index]);
    }
    cb(null, tasks, new Date());

  });
};

module.exports.getColumns = getColumns;
module.exports.retrieveFromType = retrieveFromType;
module.exports.retrieveAttachements = retrieveAttachements;