'use strict';

var sharedFormat = require('./shared');

module.exports = function(lead, oauth, cb) {
  var metadata = {};

  // General informations
  metadata.salesforce_id = lead.Id;
  if (lead.Name) {
    metadata.name = lead.Name;
  }
  if (lead.Description) {
    metadata.description = lead.Description;
  }
  if (lead.Email) {
    metadata.email = [{email: lead.Email, type: 'Pro'}];
  }

  // Extract Phones Numbers
  metadata.phone = [];
  if (lead.Phone) {
    metadata.phone.push({phone:lead.Phone, type: 'Phone'});
  }
  if (lead.Fax) {
    metadata.phone.push({phone:lead.Fax, type: 'Fax'});
  }
  if (lead.MobilePhone) {
    metadata.phone.push({phone:lead.MobilePhone, type: 'MobilePhone'});
  }

  // Extract Jobs informations
  if (lead.Title) {
    metadata.jobTitle = lead.Title;
  }
  if (lead.Company) {
    metadata.workFor = lead.Company;
  }

  // Extract Adress
  metadata.address = '';
  if (lead.Street) {
    metadata.address = lead.Street;
  }
  if (metadata.address.length && (lead.PostalCode || lead.City)) {
    metadata.address += ', ';
  }
  if (lead.PostalCode) {
    metadata.address += lead.PostalCode;
  }
  if (lead.City) {
    metadata.address += lead.City;
  }
  if (metadata.length && lead.Country) {
    metadata.address += ', ' + lead.Country;
  }
  if (lead.Country) {
    metadata.address += lead.Country;
  }

  var formatedContact = {
    identifier: sharedFormat.identifier(lead.Id, oauth),
    creation_date: new Date(lead.CreatedDate),
    metadata: metadata,
    data: {},
    document_type: 'contact',
    actions: {
      show : sharedFormat.docUrl(lead.Id, oauth),
    }
  };

  cb(null, formatedContact);
};
