'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

// Avaible formatters for salesforce
var formatters = {
  attachment: require('../formatting/attachment.js'),
  contact: require('../formatting/contact.js'),
  lead: require('../formatting/lead.js'),
  note: require('../formatting/note.js'),
  task: require('../formatting/task.js'),
  event: require('../formatting/event.js')
};

var uploadDocument = function(doc, cluestrClient, datas, cb) {
  // console.log(doc, '\n');
  cluestrClient.sendDocument(doc, function(err, res) {
    console.log(err, res);
    cb();
  });
};

var uploadFile = function(doc, fileConfig, cluestrClient, datas, cb) {
  //Stream the file
  var path = '/tmp/' + doc.metadatas.salesforce_id;
  var tmpFile = fs.createWriteStream(path);
  var docStream = org.getAttachmentBody(doc.metadatas.salesforce_id, datas);

  docStream.pipe(tmpFile);
  
  tmpFile.on('error', function(err) {
    console.log(err);
  });

  // Finished the stream
  docStream.on('end', function(){
    fileConfig.file = fs.createReadStream(path);
    console.log(doc, '\n');

    // Send back the file to anyFetch
    cluestrClient.sendDocumentAndFile(doc, fileConfig, function(err, res) {
      console.log(err, res);
      fs.unlink(path, cb);
    });

  });
};

var deleteDocument = function(doc, cluestrClient, datas, cb) {
  // Identifier creation
  var userUrl = datas.id;
  var userId = userUrl.substring(userUrl.lastIndexOf('/'));
  var identifier = datas.instance_url + userId + '/' + doc.Id;

  // Delete the document
  console.log('DELING', identifier);
  cluestrClient.deleteDocument(identifier, cb);
};

module.exports = function(doc, cluestrClient, datas, cb) {
  if (doc.IsDeleted) {
    deleteDocument(doc, cluestrClient, datas, cb);
  } else {
    var type = doc.attributes.type.toLowerCase();
    formatters[type](doc, datas, function(err, formatedDoc, fileConfig) {

      formatedDoc.user_access = [cluestrClient.accessToken];
      if (fileConfig) {
        uploadFile(formatedDoc, fileConfig, cluestrClient, datas, cb);
      } else {
        uploadDocument(formatedDoc, cluestrClient, datas, cb);
      }
    });
  }
};