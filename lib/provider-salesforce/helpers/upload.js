'use strict';

module.exports = function(contact, cluestrClient, datas, cb) {
  
  console.log("Uploading");
  var datas = {};

  var object = {
  	identifier: contact.attributes.url,
    metadatas: {
      name: contact.FirstName,
      family_name: contact.LastName,
      phone: contact.Phone,
      email: contact.Email
    },
    datas: datas,
    semantic_document_type: 'contact',
    actions: {},
    user_access: [cluestrClient.accessToken]
  }

  console.log(object);

  cluestrClient.sendDocument(object, cb);
};