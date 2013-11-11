'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

module.exports = function(doc, cluestrClient, datas, cb) {

  console.log(JSON.stringify(doc));

  var document = {
    identifier: 'http://salesforce.com/' + doc.Id,
    actions: {},
    metadatas: {
      title: doc.Name
    },
    binary_document_type: "file",
    user_access: [cluestrClient.accessToken]
  };
  
     
  var fileConfig = {
     file: org.getAttachmentBody(doc.Id, datas),
     fileLength: doc.BodyLength
   }

     // Let's roll.
     cluestrClient.sendDocumentAndFile(document, fileConfig, cb);

  // cluestrClient.sendDocument(object, cb);
}