'use strict';

var sharedFormat = require('./shared');

module.exports = function(attachment, oauth, cb) {

  if (!attachment.Name) {
    return cb('No title');
  }
  
  var formatedAttachment = {
    identifier: sharedFormat.identifier(attachment.Id, oauth),
    actions: {
    show : sharedFormat.docUrl(attachment.Id, oauth),
    },
    metadatas: {
      salesforce_id: attachment.Id,
      title: attachment.Name
    },
    binary_document_type: 'file'
  };

 var fileConfig = {
    filename: attachment.Name
  };

  cb(null, formatedAttachment, fileConfig);
};