'use strict';

var config = require('../../../config/configuration.js');
var fs = require('fs');
var org = config.salesforce_org;

var uploadContact = function(contact, cluestrClient, datas, cb) {
  var datas = {};
  var identifier = 'http://salesforce.com/' + contact.Id;

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
    identifier: identifier,
    metadatas: {
      name: contact.Name,
      phone: phones,
      job: jobTitle,
      email: [{email: contact.Email, type: "Pro"}]
    },
    datas: datas,
    semantic_document_type: 'contact',
    actions: {},
    user_access: [cluestrClient.accessToken]
  }

  console.log('//----------------------------------------- \n\n')
  // console.log(JSON.stringify(contact));
  console.log(JSON.stringify(object));

  cluestrClient.sendDocument(object, cb);
}

var uploadDoc = function(doc, cluestrClient, datas, cb) {
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

} 

module.exports = function(doc, cluestrClient, datas, cb) {
  if (doc.attributes.type == 'Attachment') {
    // console.log("Doc :" + JSON.stringify(doc)+'\n\n');
    uploadDoc(doc, cluestrClient, datas, cb);

  } else if(doc.attributes.type == 'Contact') {
    // console.log("Contact :" + JSON.stringify(doc)+'\n\n');
    uploadContact(doc, cluestrClient, datas, cb);

  };
}