'use strict';
const nodemailer = require('nodemailer');
const yargs = require('yargs').argv;
const qrcode = require('qrcode-terminal');
const fs = require('fs');

qrcode.generate(yargs.account, {small: true}, function (qrcode) {
    console.log(qrcode)
    // qrcode = qrcode.replace(//g,'');
    // qrcode = qrcode.replace(/\[0m/g, '');
    qrcode = qrcode.replace(/\[47m  \[0m/g, 'ww');
    qrcode = qrcode.replace(/\[40m  \[0m/g, '██');

    fs.writeFileSync('./qr.txt', qrcode)
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: '0.0.0.0',
            port: 1025,
            secure: false, // true for 465, false for other ports
            tls: {
                rejectUnauthorized: false
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: qrcode, // plain text body
            html: qrcode // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
});

