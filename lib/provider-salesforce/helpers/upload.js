'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

// Avaible formatters for salesforce
var formatters = {
  attachment: require('../formatting/attachment.js'),
  contact: require('../formatting/contact.js'),
  lead: require('../formatting/lead.js')
};

var uploadDocument = function(doc, cluestrClient, datas, cb) {
  console.log(doc);
  cluestrClient.sendDocument(doc, function() {
    // console.log(err, JSON.stringify(res));
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
    console.log(doc);

    // Send back the file to anyFetch
    cluestrClient.sendDocumentAndFile(doc, fileConfig, function() {
      // console.log(err, JSON.stringify(res));
      fs.unlink(path, cb);
    });

  });
};

module.exports = function(doc, cluestrClient, datas, cb) {

  var type = doc.attributes.type.toLowerCase();
  formatters[type](doc, datas, function(err, formatedDoc, fileConfig) {

    formatedDoc.user_access = [cluestrClient.accessToken];
    if (fileConfig) {
      uploadFile(formatedDoc, fileConfig, cluestrClient, datas, cb);
    } else {
      uploadDocument(formatedDoc, cluestrClient, datas, cb);
    }

  });
};