'use strict';

require('should');

var noteFormatter = require('../lib/provider-salesforce/formatting/event');
var eventTest =  {
  attributes: {
    type: 'Event',
    url: '/services/data/v29.0/sobjects/Event/00Ub0000002CBYMEA4'
  },
  Id : 'eventId',
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

      res.metadata.startDate.should.eql(new Date('2013-11-11T20:00:00.000+0000'));
      res.metadata.endDate.should.eql(new Date('2013-11-11T21:00:00.000+0000'));
      res.metadata.name.should.be.equal('Réunion avec ce mec !');
      res.metadata.description.should.be.equal('La description de la réunion');

      res.semantic_document_type.should.be.equal('event');
      res.identifier.should.be.equal('http://eu.salesforce/user-id/eventId');

      res.related.should.include('http://eu.salesforce/user-id/003b000000GVg5RAAT');
      res.related.length.should.be.equal(1);
      done(err);

    });
  });
});
