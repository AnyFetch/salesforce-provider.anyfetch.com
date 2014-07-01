'use strict';

var sharedFormat = require('./shared');

module.exports = function(contact, oauth, cb) {
  var metadata = {};


  // General informations
  metadata.salesforce_id = contact.Id;
  if (contact.Name) metadata.name = contact.Name;
  if (contact.Email) metadata.email = [{email: contact.Email, type: 'Pro'}];

  // Extract Phones Numbers
  metadata.phone = [];
  if (contact.Phone) metadata.phone.push({phone:contact.Phone, type: 'Phone'});
  if (contact.Fax) metadata.phone.push({phone:contact.Fax, type: 'Fax'});
  if (contact.MobilePhone) metadata.phone.push({phone:contact.MobilePhone, type: 'MobilePhone'});

  // Extract Jobs informations
  if (contact.Title) metadata.jobTitle = contact.Title;
  if (contact.Account) metadata.workFor = contact.Account.Name;

  // Extract Adress
  metadata.address = '';
  if (contact.Street) metadata.address = contact.Street;
  if (metadata.length && (contact.PostalCode || contact.City)) metadata.address += ', ';
  if (contact.PostalCode) metadata.address += contact.PostalCode;
  if (contact.City) metadata.address += contact.City;
  if (metadata.length && contact.Country) metadata.address += ', ' + contact.Country;
  if (contact.Country) metadata.address += contact.Country;

  var formatedContact = {
    identifier: sharedFormat.identifier(contact.Id, oauth),
    creation_date: new Date(contact.CreatedDate),
    metadata: metadata,
    data: {},
    document_type: 'contact',
    actions: {
      show : sharedFormat.docUrl(contact.Id, oauth),
    }
  };

  cb(null, formatedContact);
};
