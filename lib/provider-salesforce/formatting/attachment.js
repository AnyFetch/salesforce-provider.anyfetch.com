'use strict';

var sharedFormat = require('./shared');

module.exports = function(attachment, oauth, cb) {
  var formatedAttachment = {
    identifier: _identifier(doc.Id, datas),
    actions: {
    show : _docUrl(doc.Id, datas),
    },
    metadatas: {
      title: doc.Name
    },
    binary_document_type: "file",
  };

  cb(null, formatedContact);
};