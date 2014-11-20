'use strict';

var upload = require('./helpers/upload.js');

module.exports.addition = function additionQueueWorker(job, cb) {
  console.log("UPLOADING", job.task.identifier);
  upload(job.serviceData.instanceUrl, job.task, job.anyfetchClient, cb);
};

module.exports.deletion = function deletionQueueWorker(job, cb) {
  console.log("DELETING", job.task.identifier);
  job.anyfetchClient.deleteDocumentByIdentifier(job.task.identifier, function(err) {
    if(err && err.toString().match(/expected 204 "No Content", got 404 "Not Found"/i)) {
      err = null;
    }

    cb(err);
  });
};
