/**
 * @file Defines the provider settings.
 *
 * Will set the path to Mongo, and applications id
 * Most of the configuration can be done using system environment variables.
 */

// Instanciate SalesForce URI
var nforce = require("nforce");

// Create the application instance to manipulate the Salesforce API
// Optional parameter : It uses the current salesforce API in production mode
var org = nforce.createConnection({
  clientId: process.env.SALESFORCE_ID,
  clientSecret: process.env.SALESFORCE_SECRET,
  redirectUri: process.env.SALESFORCE_CALLBACK_URL,
});

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";

// Port to run the app on. 8000 for development
// (Vagrant syncs this port)
// 80 for production
var default_port = 8000;
if(node_env === "production") {
  default_port = 80;
}

// Exports configuration for use by app.js
module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,
  mongo_url: process.env.MONGO_URL || ("mongodb://localhost/provider-salesforce-" + node_env),

  salesforce_org: org,
  salesforce_callback: process.env.SALESFORCE_CALLBACK_URL,
  salesforce_connect: org.getAuthUri(),

  cluestr_id: process.env.SALESFORCE_CLUESTR_ID,
  cluestr_secret: process.env.SALESFORCE_CLUESTR_SECRET,

  max_concurrency: process.env.SALESFORCE_MAX_CONCURRENCY || 5,
  workers: process.env.WORKERS || 2,
};