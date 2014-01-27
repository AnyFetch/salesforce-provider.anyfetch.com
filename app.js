'use strict';

// Load configuration and initialize server
var anyfetchProvider = require('anyfetch-provider');
var serverConfig = require('./lib/provider-salesforce');

var server = anyfetchProvider.createServer(serverConfig);

// Expose the server
module.exports = server;
