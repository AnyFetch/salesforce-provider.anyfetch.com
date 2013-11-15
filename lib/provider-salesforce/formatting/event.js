'use strict';

var sharedFormat = require('./shared');

module.exports = function(event, oauth, cb) {
  var metadatas = {};

  if (event.Subject) metadatas.name = event.Subject;
  if (event.Description) metadatas.description = event.Description;
  if (event.StartDateTime) metadatas.startDate = event.StartDateTime;
  if (event.EndDateTime) metadatas.endDate = event.EndDateTime;

  var formatedEvent = {
    identifier: sharedFormat.identifier(event.Id, oauth),
    creation_date: new Date(event.CreatedDate),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'event',
    related: [sharedFormat.identifier(event.ReleatedParentId, oauth)],
    actions: {
      show : sharedFormat.docUrl(event.Id, oauth),
    }
  };

  cb(null, formatedEvent);
};