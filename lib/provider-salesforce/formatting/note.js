'use strict';

var sharedFormat = require('./shared');

module.exports = function(note, oauth, cb) {
  var metadata = {};

  if (note.Title) {
    metadata.title = note.Title;
  }
  if (note.Body) {
    metadata.text = note.Body;
  }
  if (note.ReleatedParentName) {
    metadata.parentName = note.ReleatedParentName;
  }

  var formatedNote = {
    identifier: sharedFormat.identifier(note.Id, oauth),
    creation_date: new Date(note.CreatedDate),
    metadata: metadata,
    data: {},
    document_type: 'document',
    related: [],
    actions: {
      show : sharedFormat.docUrl(note.Id, oauth),
    }
  };

  cb(null, formatedNote);
};
