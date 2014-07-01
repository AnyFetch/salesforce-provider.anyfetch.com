'use strict';

require('should');

var taskFormatter = require('../lib/provider-salesforce/formatting/task');
var taskTest =  {
  attributes: {
    type: 'Task',
    url: '/services/data/v29.0/sobjects/Task/00Tb000000AienBEAR'
  },
  Id: 'taskId',
  Subject: 'Appel du 10 nov',
  Status: 'Completed',
  ActivityDate: '2013-11-11',
  Description: 'Il a parlé de tout et de rien et surtout à propos de Betty Fair et Tim Barr !',
  ReleatedParentId: '003b000000GVg5RAAT'
};

var oauth = {
  id: '/user-id',
  userUrl: 'http://eu.salesforce/test-user',
  instance_url: 'http://eu.salesforce'
};

describe('Task formatting', function () {

  it('should return the right structure', function(done) {
    taskFormatter(taskTest, oauth, function(err, res){
      res.metadata.subject.should.be.equal('Appel du 10 nov');
      res.metadata.status.should.be.equal('Completed');
      res.metadata.description.should.be.equal('Il a parlé de tout et de rien et surtout à propos de Betty Fair et Tim Barr !');
      res.metadata.dueDate.should.be.eql(new Date('2013-11-11'));

      res.document_type.should.be.equal('task');
      res.identifier.should.be.equal('http://eu.salesforce/user-id/taskId');

      done(err);
    });
  });
});
