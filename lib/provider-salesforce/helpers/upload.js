'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

var _identifier = function(id, oauth) {
  return oauth.instance_url + '/' + id;
}

var uploadLead = function(lead, cluestrClient, datas, cb) {
  var metadatas = {};

  if (lead.Name) {metadatas.name = lead.Name};
  if (lead.Description) {metadatas.description = lead.Description};
  if (lead.Title && lead.Company) {metadatas.job = lead.Title + ' at ' + lead.Company}
  if (lead.Email) {metadatas.email = [{email: lead.Email, type: "Pro"}] };

  var phones = [];
  if (lead.Phone) { phones.push({phone:lead.Phone, type: "Phone"}) };
  if (lead.Fax) { phones.push({phone:lead.Fax, type: "Fax"}) };
  if (lead.MobilePhone) { phones.push({phone:lead.MobilePhone, type: "MobilePhone"}) };
  metadatas.phone = phones;


  var leadObject = {
    identifier: _identifier(lead.Id, datas),
    actions: {
      show : _identifier(lead.Id, datas),
    },
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    user_access: [cluestrClient.accessToken]
  };

  cluestrClient.sendDocument(leadObject, cb);
}

var uploadContact = function(contact, cluestrClient, datas, cb) {
  var datas = {};

  var phones = [];
  if (contact.Phone) { phones.push({phone:contact.Phone, type: "Phone"}) };
  if (contact.Fax) { phones.push({phone:contact.Fax, type: "Fax"}) };
  if (contact.MobilePhone) { phones.push({phone:contact.MobilePhone, type: "MobilePhone"}) };
  if (contact.HomePhone) { phones.push({phone:contact.HomePhone, type: "HomePhone"}) };
  if (contact.OtherPhone) { phones.push({phone:contact.OtherPhone, type: "OtherPhone"}) };
  if (contact.AssistantPhone) { phones.push({phone:contact.AssistantPhone, type: "AssistantPhone"}) };

  var jobTitle = "";
  if (contact.Title) { jobTitle = contact.Title};
  if (contact.Department) { jobTitle == "" ? jobTitle = contact.Department : jobTitle += " in " + contact.Department};
  if (contact.Account) { jobTitle == "" ? jobTitle = contact.Account.Name : jobTitle += " at " + contact.Account.Name};

  var object = {
    identifier: _identifier(contact.Id, datas),
    metadatas: {
      name: contact.Name,
      phone: phones,
      job: jobTitle,
      email: [{email: contact.Email, type: "Pro"}]
    },
    datas: datas,
    semantic_document_type: 'contact',
    actions: {
      show : _identifier(contact.Id, datas),
    },
    user_access: [cluestrClient.accessToken]
  }

  cluestrClient.sendDocument(object, cb);
}

var uploadDoc = function(doc, cluestrClient, datas, cb) {
  var document = {
    identifier: _identifier(doc.Id, datas),
    actions: {
      show : _identifier(doc.Id, datas),
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
        fs.unlink(path, cb);
      });

  })
} 

module.exports = function(doc, cluestrClient, datas, cb) {

  if (doc.attributes.type == 'Attachment') {
    uploadDoc(doc, cluestrClient, datas, cb);

  } else if(doc.attributes.type == 'Contact') {
    uploadContact(doc, cluestrClient, datas, cb);

  } else if(doc.attributes.type == 'Lead') {
    uploadLead(doc, cluestrClient, datas, cb);
  };
}