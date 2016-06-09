var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');

var config = require('./config');

var transporter = nodemailer.createTransport(directTransport());


module.exports = (function(){
    function sendMail(receiver, subject, content){
        //send mail with defined transport object
        var mailOptions = {
            from: config.email.senderAdress, //sender address
            to: receiver, //list of receivers
            subject: subject, //Subject line
            text: content, //plaintext body
            //html: '<b>Hello world</b>' // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }

    return {
        sendMail: sendMail
    };
})();