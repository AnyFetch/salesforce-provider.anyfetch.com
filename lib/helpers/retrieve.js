'use strict';

function retrieveContact(conn, date, limit, offset, cb) {
  conn.sobject("Contact")
    .select('Id, IsDeleted, FirstName, LastName, Name, Phone, Fax, MobilePhone, MailingStreet, HomePhone, OtherPhone, AssistantPhone, Email, Title, Birthdate, PhotoUrl, CreatedDate, LastModifiedDate')
    .where('LastModifiedDate >= ' + date.toISOString())
    .orderby('LastModifiedDate', 'DESC')
    .limit(limit)
    .offset(offset)
    .execute(cb);
}

module.exports = function retrieveContacts(conn, cursor, limit, cb) {
  if(!cursor) {
    cursor = new Date(1970);
  }

  var counter = 0;
  var contacts = [];
  function retryRetrieve(cb) {
    retrieveContact(conn, cursor, limit, counter, function(err, results) {
      if(err) {
        return cb(err);
      }

      contacts = contacts.concat(results);
      counter += results.length;

      // We can't have an offset greater than 2000
      // So we need to stop with counter > 2000
      if(results.length !== limit || counter > 2000) {
        return cb(null, new Date(), contacts);
      }
      else {
        return retryRetrieve(cb);
      }
    });
  }

  retryRetrieve(cb);
};
