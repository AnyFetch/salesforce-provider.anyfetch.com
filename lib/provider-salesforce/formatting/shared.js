'use strict';

var identifier = function(id, oauth) {
  var userUrl = oauth.id;
  var userId = userUrl.substring(userUrl.lastIndexOf('/'));


  return oauth.instance_url + userId + '/' + id;
};

var docUrl = function(id, oauth) {
  return oauth.instance_url + '/' + id;
};

module.exports = {
	identifier: identifier,
	docUrl: docUrl
};