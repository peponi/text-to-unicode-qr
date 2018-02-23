'use strict'

const nodemailer = require('nodemailer')
const yargs = require('yargs').argv
const qrcode = require('qrcode-terminal')
const quotedPrintable = require('quoted-printable')
const utf8 = require('utf8')
const invertedQrCodeWithPadding = require('./src/invertedQrCodeWithPadding')

qrcode.generate(yargs.account, {small: true}, function (qrcode) {

    let mailQrCode = `<pre style="background:black;color:white;padding:30px;">\n${qrcode}</pre>`
    let textQrCode = invertedQrCodeWithPadding(qrcode)

    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: '0.0.0.0',
            port: 1025,
            secure: false, // true for 465, false for other ports
            tls: {
                rejectUnauthorized: false
            }
        })

        // textQrCode = new Buffer(textQrCode).toString('base64') // base64 encode
        textQrCode = quotedPrintable.encode(utf8.encode(textQrCode))

        // setup email data with unicode symbols
        // https://nodemailer.com/message/custom-source/
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: 'bar@blurdybloop.com, baz@blurdybloop.com, pep0ni@protonmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            // text: textQrCode, // plain text body
            // html: mailQrCode, // html body
            raw: `From: sender@example.com
Content-Type: multipart/alternative;
 boundary="--_NmP-9033b9271ff930df-Part_1"
From: =?UTF-8?Q?Fred_Foo_=F0=9F=91=BB?= <foo@blurdybloop.com>
To: bar@blurdybloop.com, baz@blurdybloop.com
Subject: Hello =?UTF-8?Q?=E2=9C=94?=
Message-ID: <b56a0b57-7005-4efe-d4bf-5ad90c9d9330@blurdybloop.com>
Date: Fri, 26 Jan 2018 14:47:17 +0000
MIME-Version: 1.0

----_NmP-e3af7e65a26e2087-Part_1
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: base64

${mailQrCode}
----_NmP-e3af7e65a26e2087-Part_1
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: ascii

${textQrCode}
----_NmP-e3af7e65a26e2087-Part_1--`
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            console.log('Message sent: %s', info.messageId)
            // Preview only available when sending through an Ethereal account

            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
});
