'use strict';

var sharedFormat = require('./shared');

module.exports = function(task, oauth, cb) {
  var metadatas = {};

  if (task.Subject) {
    metadatas.subject = task.Subject;
  }
  if (task.Status) {
    metadatas.status = task.Status;
  }
  if (task.Description) {
    metadatas.description = task.Description;
  }
  if (task.ActivityDate) {
    metadatas.dueDate = new Date(task.ActivityDate);
  }
  if (task.ReleatedParentName) {
    metadatas.parentName = task.ReleatedParentName;
  }

  var formatedEvent = {
    identifier: sharedFormat.identifier(task.Id, oauth),
    creation_date: new Date(task.CreatedDate),
    metadatas: metadatas,
    datas: {},
    document_type: 'task',
    related: [],
    actions: {
      show : sharedFormat.docUrl(task.Id, oauth),
    }
  };

  cb(null, formatedEvent);
};
