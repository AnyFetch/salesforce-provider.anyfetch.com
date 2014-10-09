'use strict';

module.exports = function mapperContact(data) {
  var contact = {
    email: [],
    phone: [],
    address: []
  };

  contact.family_name = data.LastName;
  contact.name = data.Name;
  contact.given_name = data.FirstName;
  contact.image = data.PhotoUrl;
  contact.birthday = data.Birthdate;
  contact.jobTitle = data.Title;

  if(data.Email) {
    contact.email.push({
      email: data.Email
    });
  }

  if(data.MailingStreet) {
    contact.address.push({
      address: data.MailingStreet
    });
  }

  if(data.Phone) {
    contact.phone.push({
      phone: data.Phone
    });
  }

  if(data.Fax) {
    contact.phone.push({
      phone: data.Fax,
      type: 'fax'
    });
  }

  if(data.MobilePhone) {
    contact.phone.push({
      phone: data.MobilePhone,
      type: 'mobile'
    });
  }

  if(data.HomePhone) {
    contact.phone.push({
      phone: data.HomePhone,
      type: 'home'
    });
  }

  if(data.OtherPhone) {
    contact.phone.push({
      phone: data.OtherPhone,
      type: 'other'
    });
  }

  if(data.AssistantPhone) {
    contact.phone.push({
      phone: data.AssistantPhone,
      type: 'assistant'
    });
  }

  return contact;
};