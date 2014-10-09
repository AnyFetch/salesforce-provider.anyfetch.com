'use strict';

var rarity = require('rarity');
var mapper = require('./mapper.js');

module.exports = function uploadContact(data, anyfetchClient, cb) {
  var document = {
    identifier: data.identifier,
    data: {
      id: data.Id
    },
    metadata: mapper(data),
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