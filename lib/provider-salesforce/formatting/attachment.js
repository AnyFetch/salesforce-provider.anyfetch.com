'use strict';

var sharedFormat = require('./shared');

module.exports = function(attachment, oauth, cb) {

  if (!attachment.Name) {
    return cb('No title');
  }

  var parentName = '';
  if (attachment.ReleatedParentName) parentName = attachment.ReleatedParentName;
  
  var formatedAttachment = {
    identifier: sharedFormat.identifier(attachment.Id, oauth),
    creation_date: new Date(attachment.CreatedDate),
    actions: {
    show : sharedFormat.docUrl(attachment.Id, oauth),
    },
    metadatas: {
      parentName: parentName,
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