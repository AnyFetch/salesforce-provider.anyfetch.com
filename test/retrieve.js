'use strict';

var should = require('should');
var jsforce = require('jsforce');

var config = require('../config/configuration.js');
var retrieve = require('../lib/helpers/retrieve.js');

describe("Retrieve code", function () {
  var conn = new jsforce.Connection({
    oauth2 : {
      clientId : config.salesforceId,
      clientSecret : config.salesforceSecret,
      redirectUri : config.providerUrl + "/init/callback"
    },
    refreshToken: config.testRefreshToken,
    instanceUrl : 'https://emea.salesforce.com',
  });

  it("should list contacts", function (done) {
    retrieve(conn, new Date(0), 50, function(err, newCursor, contacts) {
      if(err) {
        return done(err);
      }

      should.exist(contacts[0]);
      contacts[0].should.have.property('Id');
      contacts[0].should.have.property('CreatedDate');
      contacts[0].should.have.property('LastModifiedDate');

      done();
    });
  });

  it("should list contacts modified after specified date", function (done) {
    retrieve(conn, new Date(2020, 7, 22), 50, function(err, newCursor, contacts) {
      if(err) {
        return done(err);
      }

      contacts.should.have.lengthOf(0);

      done();
    });
  });
});
