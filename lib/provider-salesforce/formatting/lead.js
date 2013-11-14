'use strict';

var sharedFormat = require('./shared');

module.exports = function(lead, oauth, cb) {
  var metadatas = {};

  // General informations
  metadatas.salesforce_id = lead.Id;
  if (lead.Name) metadatas.name = lead.Name;
  if (lead.Description) metadatas.description = lead.Description;
  if (lead.Email) metadatas.email = [{email: lead.Email, type: 'Pro'}];

  // Extract Phones Numbers
  metadatas.phone = [];
  if (lead.Phone) metadatas.phone.push({phone:lead.Phone, type: 'Phone'});
  if (lead.Fax) metadatas.phone.push({phone:lead.Fax, type: 'Fax'});
  if (lead.MobilePhone) metadatas.phone.push({phone:lead.MobilePhone, type: 'MobilePhone'});

  // Extract Jobs informations
  if (lead.Title) metadatas.jobTitle = lead.Title;
  if (lead.Company) metadatas.workFor = lead.Company;

  // Extract Adress
  metadatas.address = '';
  if (lead.Street) metadatas.address = lead.Street;
  if (metadatas.address.length && (lead.PostalCode || lead.City)) metadatas.address += ', ';
  if (lead.PostalCode) metadatas.address += lead.PostalCode;
  if (lead.City) metadatas.address += lead.City;
  if (metadatas.length && lead.Country) metadatas.address += ', ' + lead.Country;
  if (lead.Country) metadatas.address += lead.Country;

  var formatedContact = {
    identifier: sharedFormat.identifier(lead.Id, oauth),
    creation_date: new Date(lead.CreatedDate),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    actions: {
      show : sharedFormat.docUrl(lead.Id, oauth),
    }
  };

  cb(null, formatedContact);
};
