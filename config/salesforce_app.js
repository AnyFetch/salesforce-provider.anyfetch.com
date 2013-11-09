'use strict';

var nforce = require("nforce");

module.exports = {

  // Create the application instance to manipulate the Salesforce API
  // Optional parameter : It uses the current salesforce API in production mode
  org: nforce.createConnection({
    clientId: process.env.SALESFORCE_ID,
    clientSecret: process.env.SALESFORCE_SECRET,
    redirectUri: process.env.SALESFORCE_CALLBACK_URL,
  })

};