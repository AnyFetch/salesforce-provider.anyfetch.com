'use strict';

require('should');

var config = require('../config/configuration.js');
var retrieve = require('../lib/provider-salesforce/helpers/retrieve');

var org = config.salesforce_org;
var oauth = {
  instance_url : 'https://eu2.salesforce.com',
  access_token : 'useless-access_token-just-for-validate-the-oauth-object',
  refresh_token: process.env.SALESFORCE_TEST_REFRESH_TOKEN
};


describe('Retrieve tokens', function () {

  it('should get an updated refresh_token', function(done) {
    org.refreshToken(oauth, function(err, tokens) {
      tokens.should.have.property('access_token');
      done();
    });
  });

});

describe('Retrieve', function() {
  var newAuth = {};
  before(function(done) {
    org.refreshToken(oauth, function(err, tokens) {
      newAuth = tokens;
      done(err);
    });
  });

  it('should retrieve all columns', function(done) {
    retrieve.getColumns(newAuth, 'Lead', function(err, res) {
      res.should.include('Name');
      res.should.include('Id');
      done(err);
    });
  });

  it('should retrive the name of the company for a contact', function(done) {
    retrieve.getColumns(newAuth, 'Contact', function(err, res) {
      res.should.include('Account.name');
      done(err);
    });
  });

  it('should retrieve all the contacts', function(done) {
    retrieve.retrieveFromType(newAuth, 'Contact', function(err, res){
      res.length.should.be.equal(20);
      res[0].attributes.type.should.be.equal('Contact');
      done(err);
    });
  });
});