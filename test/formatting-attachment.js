'use strict';

var sharedFormat = require('./shared');

module.exports = function(attachment, oauth, cb) {
  var metadatas = {};

  // General informations
  if (lead.Name) metadatas.name = lead.Name;
  if (lead.Description) metadatas.description = lead.Description;
  if (lead.Email) metadatas.email = [{email: lead.Email, type: 'Pro'}];

  // Extract Phones Numbers
  metadatas.phone = [];
  if (lead.Phone) metadatas.phone.push({phone:lead.Phone, type: 'Phone'});
  if (lead.Fax) metadatas.phones.push({phone:lead.Fax, type: 'Fax'});
  if (lead.MobilePhone) metadatas.phone.push({phone:lead.MobilePhone, type: 'MobilePhone'});

  // Extract Jobs informations
  if (lead.Title) metadatas.jobTitle = lead.Title;
  if (lead.Company) metadatas.workFor = lead.Company;

  var formatedContact = {
    identifier: sharedFormat.identifier(lead.Id, oauth),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    actions: {
      show : sharedFormat.docUrl(lead.Id, oauth),
    }
  };

  cb(null, formatedContact);
};
