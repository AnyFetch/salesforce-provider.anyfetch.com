'use strict';

require('should');

var noteFormatter = require('../lib/provider-salesforce/formatting/note');
var noteTest = {
  attributes:{
    type: 'Note',
    url: '/services/data/v29.0/sobjects/Note/002b0000002Sf79AAC'
  },
  Id: 'noteId',
  Title: 'Coucou',
  Body: 'C\'est moi qui suis ici',
  ReleatedParentId: '003b000000GVg5QAAT'
};

var oauth = {
  id: '/user-id',
  userUrl: 'http://eu.salesforce/test-user',
  instance_url: 'http://eu.salesforce'
};

describe('Note formatting', function () {

  it('should return the right structure', function(done) {
    noteFormatter(noteTest, oauth, function(err, res){
      // Test quantity of keys
      res.metadata.title.should.be.equal('Coucou');
      res.metadata.text.should.be.equal('C\'est moi qui suis ici');
      res.document_type.should.be.equal('document');
      res.identifier.should.be.equal('http://eu.salesforce/user-id/noteId');

      done(err);
    });
  });
});
