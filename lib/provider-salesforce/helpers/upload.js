'use strict';

module.exports = function(contact, cluestrClient, datas, cb) {
  
  var datas = {};
  var identifier = 'http://salesforce.com' + contact.attributes.url;

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
  console.log(JSON.stringify(contact));
  console.log(JSON.stringify(object));

  cluestrClient.sendDocument(object, cb);
};