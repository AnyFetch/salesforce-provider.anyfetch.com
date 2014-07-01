'use strict';

var sharedFormat = require('./shared');

module.exports = function(task, oauth, cb) {
  var metadata = {};

  if (task.Subject) {
    metadata.subject = task.Subject;
  }
  if (task.Status) {
    metadata.status = task.Status;
  }
  if (task.Description) {
    metadata.description = task.Description;
  }
  if (task.ActivityDate) {
    metadata.dueDate = new Date(task.ActivityDate);
  }
  if (task.ReleatedParentName) {
    metadata.parentName = task.ReleatedParentName;
  }

  var formatedEvent = {
    identifier: sharedFormat.identifier(task.Id, oauth),
    creation_date: new Date(task.CreatedDate),
    metadata: metadata,
    data: {},
    document_type: 'task',
    related: [],
    actions: {
      show : sharedFormat.docUrl(task.Id, oauth),
    }
  };

  cb(null, formatedEvent);
};
