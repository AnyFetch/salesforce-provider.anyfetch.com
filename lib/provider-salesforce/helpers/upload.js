'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

var formatters = {
  attachment: require('../formatting/attachment.js'),
  contact: require('../formatting/contact.js'),
  lead: require('../formatting/lead.js')
};
  

var _identifier = function(id, oauth) {
  var userUrl = oauth.id;
  var userId = userUrl.substring(userUrl.lastIndexOf('/'));


  return oauth.instance_url + userId + '/' + id;
};

var _docUrl = function(id, oauth) {
  return oauth.instance_url + '/' + id;
};

var uploadLead = function(lead, cluestrClient, datas, cb) {
  var metadatas = {};

  if (lead.Name) {metadatas.name = lead.Name};
  if (lead.Description) {metadatas.description = lead.Description};
  if (lead.Title) {metadatas.jobTitle = lead.Title }
  if (lead.Company) {metadatas.jobTitle = " " +lead.worksFor }
  if (lead.Email) {metadatas.email = [{email: lead.Email, type: "Pro"}] };

  var phones = [];
  if (lead.Phone) { phones.push({phone:lead.Phone, type: "Phone"}) };
  if (lead.Fax) { phones.push({phone:lead.Fax, type: "Fax"}) };
  if (lead.MobilePhone) { phones.push({phone:lead.MobilePhone, type: "MobilePhone"}) };
  metadatas.phone = phones;

  var leadObject = {
    identifier: _identifier(lead.Id, datas),
    actions: {
      show : _docUrl(lead.Id, datas),
    },
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    user_access: [cluestrClient.accessToken]
  };

  cluestrClient.sendDocument(leadObject,  function(err, res) {
    console.log(err, res);
    cb();
  });
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