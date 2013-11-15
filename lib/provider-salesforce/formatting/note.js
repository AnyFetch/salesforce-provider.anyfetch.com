'use strict';

var sharedFormat = require('./shared');

module.exports = function(note, oauth, cb) {
  var metadatas = {};

  if (note.Title) metadatas.title = note.Title;
  if (note.Body) metadatas.text = note.Body;

  var formatedNote = {
    identifier: sharedFormat.identifier(note.Id, oauth),
    creation_date: new Date(note.CreatedDate),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'document',
    related: [note.ReleatedParentId],
    actions: {
      show : sharedFormat.docUrl(note.Id, oauth),
    }
  };

  cb(null, formatedNote);
};