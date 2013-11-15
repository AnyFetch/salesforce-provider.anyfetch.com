'use strict';

var sharedFormat = require('./shared');

module.exports = function(task, oauth, cb) {
  var metadatas = {};

  if (task.Subject) metadatas.subject = task.Subject;
  if (task.Status) metadatas.status = task.Status;
  if (task.Description) metadatas.description = task.Description;
  if (task.ActivityDate) metadatas.dueDate = new Date(task.ActivityDate);

  var formatedEvent = {
    identifier: sharedFormat.identifier(task.Id, oauth),
    creation_date: new Date(task.CreatedDate),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'task',
    related: [task.ReleatedParentId],
    actions: {
      show : sharedFormat.docUrl(task.Id, oauth),
    }
  };

  cb(null, formatedEvent);
};