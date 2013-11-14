'use strict';

require('should');

var contactFormatter = require('../lib/provider-salesforce/formatting/contact');
var testContact = {
  'attributes':{'type':'Contact','url':'/services/data/v29.0/sobjects/Contact/003b000000Gp4f8AAB'},
  'Id':'003b000000Gp4f8AAB',
  'IsDeleted':false,
  'AccountId':'001b000000Gz3NnAAJ',
  'Name':'Pat Stumuller',
  'OtherStreet':'2 Place Jussieu',
  'OtherCity':'Paris',
  'OtherState':null,
  'OtherPostalCode':'75251',
  'OtherCountry':'France',
  'MailingStreet':'2 Place Jussieu',
  'MailingCity':'Paris',
  'MailingState':null,
  'MailingPostalCode':'75251',
  'MailingCountry':'France',
  'Phone':'(014) 427-4427',
  'Fax':'(014) 427-4428',
  'MobilePhone':'(014) 454-6364',
  'Email':'pat@pyramid.net',
  'Title':'SVP, Administration and Finance',
  'CreatedDate':'2013-11-12T15:56:25.000+0000',
  'LastModifiedDate':'2013-11-12T15:56:25.000+0000',
  'Account':{
    'attributes':{'type':'Account','url':'/services/data/v29.0/sobjects/Account/001b000000Gz3NnAAJ'},
    'Name':'Pyramid Construction Inc.'
  }
};
var oauth = {
  id: 'user-id',
  userUrl: 'http://eu.salesforce/test-user',
  instance_url: 'http://eu.salesforce'
};

describe('Contact formatting', function () {

  it('should return the right structure', function(done) {
    contactFormatter(testContact, oauth, function(err, res){

      // Test quantity of keys
      res.metadatas.phone.length.should.be.equal(3);
      res.metadatas.email.length.should.be.equal(1);
      res.should.ownProperty('identifier');

      done(err);

    });
  });

  it('should format get all the metadatas', function(done) {
    contactFormatter(testContact, oauth, function(err, res){
      var metadatas = res.metadatas;
      metadatas.jobTitle.should.be.equal('SVP, Administration and Finance');
      metadatas.workFor.should.be.equal('Pyramid Construction Inc.');
      metadatas.name.should.be.equal('Pat Stumuller');
      metadatas.email[0].email.should.be.equal('pat@pyramid.net');

      done(err);
    });
  });

});
