'use strict';

require('should');

var leadFormatter = require('../lib/provider-salesforce/formatting/lead');
var testLead = {
  'attributes':{'type':'Lead','url':'/services/data/v29.0/sobjects/Lead/00Qb0000005rAkmEAE'},
  'Id':'00Qb0000005rAkmEAE',
  'IsDeleted':false,
  'Name':'David Monaco',
  'Title':'CFO',
  'Company':'Blues Entertainment Corp.',
  'Street':null,
  'City':null,
  'State':null,
  'PostalCode':null,
  'Country':'Japan',
  'Phone':'(033) 452-1299',
  'MobilePhone':null,
  'Fax':null,
  'Email':'david@blues.com',
  'Description':null,
  'CreatedDate':'2013-11-12T15:56:25.000+0000',
  'LastModifiedDate':'2013-11-12T15:56:25.000+0000',
};

var oauth = {
  id: '/user-id',
  userUrl: 'http://eu.salesforce/test-user',
  instance_url: 'http://eu.salesforce'
};

describe('Lead formatting', function () {

  it('should return the right structure', function(done) {
    leadFormatter(testLead, oauth, function(err, res){

      // Test quantity of keys
      res.metadatas.phone.length.should.be.equal(1);
      res.metadatas.email.length.should.be.equal(1);

      res.identifier.should.be.equal('http://eu.salesforce/user-id/00Qb0000005rAkmEAE');

      done(err);

    });
  });

  it('should format get all the metadatas', function(done) {
    leadFormatter(testLead, oauth, function(err, res){
      var metadatas = res.metadatas;
      metadatas.jobTitle.should.be.equal('CFO');
      metadatas.workFor.should.be.equal('Blues Entertainment Corp.');
      metadatas.name.should.be.equal('David Monaco');
      metadatas.email[0].email.should.be.equal('david@blues.com');
      metadatas.address.should.be.equal('Japan');

      done(err);
    });
  });

});
