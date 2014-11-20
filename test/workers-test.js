'use strict';

require('should');
var sinon = require('sinon');

var workers = require('../lib/workers.js');

module.exports.addition = function(job, cb) {
  var stub = sinon.stub(job.anyfetchClient, 'postDocument', function(document, cb) {
    try {
      document.should.have.property('identifier');
      document.should.have.property('creation_date');
      document.should.have.property('modification_date');
    } catch(e) {
      return cb(e);
    }

    cb();
  });


  workers.addition(job, function(err) {
    try {
      stub.called.should.be.true;
      stub.restore();
    } catch(e) {
      return cb(e);
    }

    cb(err);
  });
};

module.exports.deletion = workers.deletion;
