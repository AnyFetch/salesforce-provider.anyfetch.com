'use strict';

var sharedFormat = require('./shared');

module.exports = function(contact, oauth, cb) {
  var metadatas = {};


  // General informations
  metadatas.salesforce_id = contact.Id;
  if (contact.Name) metadatas.name = contact.Name;
  if (contact.Email) metadatas.email = [{email: contact.Email, type: 'Pro'}];

  // Extract Phones Numbers
  metadatas.phone = [];
  if (contact.Phone) metadatas.phone.push({phone:contact.Phone, type: 'Phone'});
  if (contact.Fax) metadatas.phone.push({phone:contact.Fax, type: 'Fax'});
  if (contact.MobilePhone) metadatas.phone.push({phone:contact.MobilePhone, type: 'MobilePhone'});

  // Extract Jobs informations
  if (contact.Title) metadatas.jobTitle = contact.Title;
  if (contact.Account) metadatas.workFor = contact.Account.Name;

  // Extract Adress
  metadatas.address = '';
  if (contact.Street) metadatas.address = contact.Street;
  if (metadatas.length && (contact.PostalCode || contact.City)) metadatas.address += ', ';
  if (contact.PostalCode) metadatas.address += contact.PostalCode;
  if (contact.City) metadatas.address += contact.City;
  if (metadatas.length && contact.Country) metadatas.address += ', ' + contact.Country;
  if (contact.Country) metadatas.address += contact.Country;

  var formatedContact = {
    identifier: sharedFormat.identifier(contact.Id, oauth),
    creation_date: new Date(contact.CreatedDate),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    actions: {
      show : sharedFormat.docUrl(contact.Id, oauth),
    }
  };

  cb(null, formatedContact);
};