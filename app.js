"use strict";

// Load configuration and initialize server
require('newrelic');
var cluestrProvider = require('cluestr-provider');
var serverConfig = require('./lib/provider-salesforce');


var server = cluestrProvider.createServer(serverConfig);

// Expose the server
module.exports = server;
