'use strict';

/**
 * @file Defines salesforce application allowing the connection with SF.
 *
 * Application using the production mode
 * Uses the last REST API version of SF
 */

var nforce = require("nforce");

module.exports = nforce.createConnection({
    clientId: process.env.SALESFORCE_ID,
    clientSecret: process.env.SALESFORCE_SECRET,
    redirectUri: process.env.SALESFORCE_CALLBACK_URL,
});
