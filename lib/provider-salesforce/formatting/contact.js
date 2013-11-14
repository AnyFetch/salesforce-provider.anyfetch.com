'use strict';

var _identifier = function(id, oauth) {
  var userUrl = oauth.id;
  var userId = userUrl.substring(userUrl.lastIndexOf('/'));


  return oauth.instance_url + userId + '/' + id;
};

var _docUrl = function(id, oauth) {
  return oauth.instance_url + '/' + id;
};

module.exports = function(contact, oauth, cb) {
  var metadatas = {};

  // General informations
  if (contact.Name) metadatas.name = contact.Name;
  if (contact.Email) metadatas.email = [{email: contact.Email, type: 'Pro'}];

  // Extract Phones Numbers
  if (contact.Phone) metadatas.phone.push({phone:contact.Phone, type: 'Phone'});
  if (contact.Fax) metadatas.phones.push({phone:contact.Fax, type: 'Fax'});
  if (contact.MobilePhone) metadatas.phone.push({phone:contact.MobilePhone, type: 'MobilePhone'});

  // Extract Jobs informations
  if (contact.Title) metadatas.jobTitle = contact.Title;
  if (contact.Account) metadatas.workFor = contact.Account.Name;

  var formatedContact = {
    identifier: _identifier(contact.Id, oauth),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    actions: {
      show : _docUrl(contact.Id, oauth),
    }
  };

  cb(null, formatedContact);
};