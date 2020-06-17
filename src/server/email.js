var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var EmailTemplate = require('email-templates').EmailTemplate;

var transporter = nodemailer.createTransport(
  smtpTransport(
    {
      host: process.env.EMAIL_HOST || "localhost",
      port: process.env.EMAIL_PORT || 25,
      auth: {
        user: process.env.EMAIL_USER || "info@ideagarden.local",
        pass: process.env.EMAIL_PASS || "hushhush"
      },
      tls: {"rejectUnauthorized": false},
      debug: true
    }
  )
);

module.exports = (function(){
  function sendMail(receiver, subject, content, mailtype) {
    mailtype = mailtype || "confirm";
    subject = subject || "Bevestig je aanmelding";
    var templateDir = path.join(__dirname, './templates/mail', mailtype);
    var template = new EmailTemplate(templateDir);
    var templateVars = {
      title: "Ideeënvijver",
      site: "https://www.ideeenvijver.nl",
      mail: "info@ideeenvijver.nl",
      code: content
    };
    template.render(templateVars, function (err, results) {
      if (err) {
        console.log('Error rendering message template.');
        console.error(err);
        return {success: false, message: "Email could not be sent."};
      }
      transporter.sendMail({
        from: {
          name: 'Frederique van Ideeënvijver',
          address: process.env.DEFAULT_EMAIL || "info@ideagarden.local"
        },
        to: receiver,
        subject: subject,
        html: results.html,
        text: results.text,
        attachments: [{
            filename: 'logo_mail.png',
            path: './templates/mail/logo_mail.png',
            cid: 'logo@ideeenvijver.nl' //same cid value as in the html img src
        }]
      }, function (err, responseStatus) {
        if (err) {
          console.log("Error occured sending email.");
          console.log(err);
          return {success: false, message: "Error occured during send."};
        } else {
          return {success: true, message: "Email sent."};
        }
      });
    });
  }
  return {
    sendMail: sendMail
  };
})();
