'use strict';

// Load configuration and initialize server
var cluestrProvider = require('cluestr-provider');
var serverConfig = require('./lib/provider-salesforce');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cluestr-provider');
var Token = mongoose.model('Token', { cluestrToken: String, datas: {} });


if (serverConfig.env == 'production') {
  require('newrelic');
}

var server = cluestrProvider.createServer(serverConfig);

server.get('/token', function(req, res, next) {
  var sfToken = req.params.sfid;
  var anyFetchToken = '';

  Token.find({}, function(err, results) {

    results.forEach(function(storedTokens) {
      var id = storedTokens.datas.id.slice(storedTokens.datas.id.lastIndexOf('/') + 1);
      console.log(id);
      if (sfToken == id) {
        anyFetchToken = storedTokens.cluestrToken;
      }
    });

    if (anyFetchToken) {
      res.send(anyFetchToken);
    } else {
      res.send(404);
    }

  });
});

// Expose the server
module.exports = server;
