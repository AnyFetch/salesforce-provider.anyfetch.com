'use strict';

var rarity = require('rarity');
var mapper = require('./mapper.js');

module.exports = function uploadContact(instanceUrl, data, anyfetchClient, cb) {
  var document = {
    identifier: data.identifier,
    data: {
      id: data.Id
    },
    metadata: mapper(instanceUrl, data),
    actions: {
      show: data.identifier
    },
    related: [],
    document_type: 'contact',
    creation_date: data.CreatedDate,
    modification_date: data.LastModifiedDate,
    user_access: [anyfetchClient.accessToken],
  };

  anyfetchClient.postDocument(document, rarity.slice(1, cb));
};
