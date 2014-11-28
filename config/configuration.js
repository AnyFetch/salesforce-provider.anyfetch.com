/**
 * @file Defines the provider settings.
 *
 * Will set the path to Mongo, and applications id
 * Most of the configuration can be done using system environment variables.
 */

// Load environment variables from .env file
var dotenv = require('dotenv');
dotenv.load();

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

  usersConcurrency: process.env.SALESFORCE_USERS_CONCURRENCY || 1,
  concurrency: process.env.SALESFORCE_CONCURRENCY || 1,

  salesforceId: process.env.SALESFORCE_API_ID,
  salesforceSecret: process.env.SALESFORCE_API_SECRET,

  appName: process.env.APP_NAME,
  providerUrl: process.env.PROVIDER_URL,

  appId: process.env.ANYFETCH_API_ID,
  appSecret: process.env.ANYFETCH_API_SECRET,

  testRefreshToken: process.env.SALESFORCE_TEST_REFRESH_TOKEN,

  retry: 2,
  retryDelay: 4 * 1000,

  opbeat: {
    organizationId: process.env.OPBEAT_ORGANIZATION_ID,
    appId: process.env.OPBEAT_APP_ID,
    secretToken: process.env.OPBEAT_SECRET_TOKEN
  }
};
