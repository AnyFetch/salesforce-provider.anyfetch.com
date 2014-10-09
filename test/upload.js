'use strict';

var request = require('supertest');
var AnyFetchProvider = require('anyfetch-provider');
var Anyfetch = require('anyfetch');
var sinon = require('sinon');
require('should');

var config = require('../config/configuration.js');
var serverConfig = require('../lib/');

describe("Workflow", function () {
  before(AnyFetchProvider.debug.cleanTokens);

  // Create a fake HTTP server
  Anyfetch.setApiUrl('http://localhost:1337');
  var apiServer = Anyfetch.createMockServer();
  apiServer.listen(1337);

  before(function(done) {
    AnyFetchProvider.debug.createToken({
      anyfetchToken: 'fake_gc_access_token',
      data: {
        refreshToken: config.testRefreshToken,
        instanceUrl : 'https://emea.salesforce.com'
      },
      cursor: new Date(1970),
      accountName: 'accountName'
    }, done);
  });

  it("should upload data to AnyFetch", function(done) {
    var count = 0;
    var originalQueueWorker = serverConfig.workers.addition;

    serverConfig.workers.addition = function(job, cb) {
      var stub = sinon.stub(job.anyfetchClient, 'postDocument', function(document, cb) { 
        document.should.have.property('identifier');
        document.should.have.property('creation_date');
        document.should.have.property('modification_date');

        cb();
      });

      originalQueueWorker(job, function(err) {
        if(err) {
          throw err;
        }

        cb(err);
      });

      stub.called.should.be.true;
      stub.restore();

      count += 1;
      if(count === 20) {
        done();
      }
    };

    var server = AnyFetchProvider.createServer(serverConfig.connectFunctions, serverConfig.updateAccount, serverConfig.workers, serverConfig.config);

    request(server)
      .post('/update')
      .send({
        access_token: 'fake_gc_access_token',
        api_url: 'http://localhost:1337',
        documents_per_update: 2500
      })
      .expect(202)
      .end(function(err) {
        if(err) {
          throw err;
        }
      });
  });
});
