'use strict';

var _identifier = function(id, oauth) {
  var userUrl = oauth.id;
  var userId = userUrl.substring(userUrl.lastIndexOf('/'));


  return oauth.instance_url + userId + '/' + id;
};

var _docUrl = function(id, oauth) {
  return oauth.instance_url + '/' + id;
};

module.exports = function(lead, oauth, cb) {
  var metadatas = {};

  // General informations
  if (lead.Name) metadatas.name = lead.Name;
  if (lead.Description) metadatas.description = lead.Description;
  if (lead.Email) metadatas.email = [{email: lead.Email, type: 'Pro'}];

  // Extract Phones Numbers
  if (lead.Phone) metadatas.phone.push({phone:lead.Phone, type: 'Phone'});
  if (lead.Fax) metadatas.phones.push({phone:lead.Fax, type: 'Fax'});
  if (lead.MobilePhone) metadatas.phone.push({phone:lead.MobilePhone, type: 'MobilePhone'});

  // Extract Jobs informations
  if (lead.Title) metadatas.jobTitle = lead.Title;
  if (lead.Account) metadatas.workFor = lead.Account.Name;

  var formatedContact = {
    identifier: _identifier(lead.Id, oauth),
    metadatas: metadatas,
    datas: {},
    semantic_document_type: 'contact',
    actions: {
      show : _docUrl(lead.Id, oauth),
    }
  };

  cb(null, formatedContact);
};
