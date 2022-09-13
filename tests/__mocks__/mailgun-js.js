// Using mocking, we don't actually have to send the test emails.
// Mocking saves resources; we might be on a paid plan with the email provider, 
// Mocking the welcome emails, we don't waste any of the paid contingent.
// The __mocks__ folder is where Jest looks for "mocked" modules, in this case "mailgun"
// Generally, we need to export the functions that are used in emails/account.js to successfully mock this 
// module. 
// The code here deviates from the course curriculum, where Sendgrid is used. The code here
// for the export object was copied from the course Q&A.
module.exports = function (apiKey, domain) {
        const object2 = {
          send() {
          }
        }
        const object1 = {
          messages() {
            return object2
          }
        }
        return object1
      }