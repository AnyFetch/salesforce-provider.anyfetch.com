'use strict';

require('should');

var noteFormatter = require('../lib/provider-salesforce/formatting/event');
var eventTest =  {
  attributes: {
    type: 'Event',
    url: '/services/data/v29.0/sobjects/Event/00Ub0000002CBYMEA4'
  },
  Subject: 'Réunion avec ce mec !',
  Description: 'La description de la réunion',
  StartDateTime: '2013-11-11T20:00:00.000+0000',
  EndDateTime: '2013-11-11T21:00:00.000+0000',
  ReleatedParentId: '003b000000GVg5RAAT'
};

var oauth = {
  id: '/user-id',
  userUrl: 'http://eu.salesforce/test-user',
  instance_url: 'http://eu.salesforce'
};

describe('Event formatting', function () {

  it('should return the right structure', function(done) {
    noteFormatter(eventTest, oauth, function(err, res){

      res.metadatas.startDate.should.be.eq(new Date('2013-11-11T20:00:00.000+0000'));
      res.metadatas.endDate.should.be.eq(new Date('2013-11-11T20:00:00.000+0000'));
      res.metadatas.name.should.be.equal('Réunion avec ce mec !');
      res.metadatas.description.should.be.equal('La description de la réunion');

      res.semantic_document_type.should.be.equal('event');
      res.identifier.should.be.equal('http://eu.salesforce/user-id/00Ub0000002CBYMEA4');

      res.related.should.include('003b000000GVg5RAAT');
      res.related.length.should.be.equal(1);
      done(err);

    });
  });
});
