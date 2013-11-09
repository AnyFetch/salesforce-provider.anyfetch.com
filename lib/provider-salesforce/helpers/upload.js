'use strict';

module.exports = function(contact, cluestrClient, datas, cb) {
  
  var datas = {};
  var identifier = 'http://salesforce.com' + contact.attributes.url;

  var object = {
  	identifier: identifier,
    metadatas: {
      name: contact.FirstName + " " + contact.LastName,
      phone: [{phone:contact.Phone, type: "Pro"}],
      email: [{email: contact.Email, type: "Pro"}]
    },
    datas: datas,
    semantic_document_type: 'contact',
    actions: {},
    user_access: [cluestrClient.accessToken]
  }

  console.log(object);

  cluestrClient.sendDocument(object, function(err, doc) {
    console.log(doc);
    if (err) {
      throw(err);
    }
    cb();
  });
};