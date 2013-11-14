'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

var formatters = {
  attachment: require('../formatting/attachment.js'),
  contact: require('../formatting/contact.js'),
  lead: require('../formatting/lead.js')
};

var uploadContact = function(contact, cluestrClient, datas, cb) {

  formatters.contact(contact, datas, function(err, formatedContact) {
    formatedContact.user_access = [cluestrClient.accessToken];

    cluestrClient.sendDocument(formatedContact, function(err, res) {
      console.log(err, res);
      cb();
    });

  });
};

var uploadDoc = function(doc, cluestrClient, datas, cb) {
  var document = {
    identifier: _identifier(doc.Id, datas),
    actions: {
      show : _docUrl(doc.Id, datas),
    },
    metadatas: {
      title: doc.Name
    },
    binary_document_type: "file",
    user_access: [cluestrClient.accessToken]
  };

  var fileConfig = {
    filename: doc.Name
  };
  
  var path = '/tmp/' + doc.Id;
  var tmpFile = fs.createWriteStream(path);
  var docStream = org.getAttachmentBody(doc.Id, datas);

  docStream.pipe(tmpFile);
  
  tmpFile.on("error", function(err) {
    console.log(err);
  })

  docStream.on('end', function(){
    console.log('Finished');

    fileConfig.file = fs.createReadStream(path);
      cluestrClient.sendDocumentAndFile(document, fileConfig, function(err, res) {
        console.log(res);
        fs.unlink(path, cb);
      });

  })
} 

module.exports = function(doc, cluestrClient, datas, cb) {
  var type = doc.attributes.type.toLowerCase();
  formatters[type](doc, datas, function(err, res) {
    console.log(err, res);
  });
};