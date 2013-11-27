'use strict';

var sharedFormat = require('./shared');

module.exports = function(event, oauth, cb) {
  var metadatas = {};

  if (event.Subject) metadatas.name = event.Subject;
  if (event.Description) metadatas.description = event.Description;
  if (event.StartDateTime) metadatas.startDate = new Date(event.StartDateTime);
  if (event.EndDateTime) metadatas.endDate = new Date(event.EndDateTime);
  if (event.ReleatedParentName) metadatas.parentName = event.ReleatedParentName;

  var formatedEvent = {
    identifier: sharedFormat.identifier(event.Id, oauth),
    creation_date: new Date(event.CreatedDate),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'event',
    related: [],
    actions: {
      show : sharedFormat.docUrl(event.Id, oauth),
    }
  };

  cb(null, formatedEvent);
};