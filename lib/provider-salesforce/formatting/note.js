'use strict';

var sharedFormat = require('./shared');

module.exports = function(note, oauth, cb) {
  var metadatas = {};

  if (note.Title) {
    metadatas.title = note.Title;
  }
  if (note.Body) {
    metadatas.text = note.Body;
  }
  if (note.ReleatedParentName) {
    metadatas.parentName = note.ReleatedParentName;
  }

  var formatedNote = {
    identifier: sharedFormat.identifier(note.Id, oauth),
    creation_date: new Date(note.CreatedDate),
    metadatas: metadatas,
    datas: {},
    document_type: 'document',
    related: [],
    actions: {
      show : sharedFormat.docUrl(note.Id, oauth),
    }
  };

  cb(null, formatedNote);
};
