'use strict';

var sharedFormat = require('./shared');

module.exports = function(event, oauth, cb) {
  var metadata = {};

  if(event.Subject) {
    metadata.name = event.Subject;
  }
  if(event.Description) {
    metadata.description = event.Description;
  }

  if(event.StartDateTime) {
    metadata.startDate = new Date(event.StartDateTime);
  }
  if(event.EndDateTime) {
    metadata.endDate = new Date(event.EndDateTime);
  }

  if(event.ReleatedParentName) {
    metadata.parentName = event.ReleatedParentName;
  }

  var formatedEvent = {
    identifier: sharedFormat.identifier(event.Id, oauth),
    creation_date: new Date(event.CreatedDate),
    metadata: metadata,
    data: {},
    document_type: 'event',
    related: [],
    actions: {
      show : sharedFormat.docUrl(event.Id, oauth),
    }
  };

  cb(null, formatedEvent);
};
