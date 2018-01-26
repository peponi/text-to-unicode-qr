'use strict';
const nodemailer = require('nodemailer');
const yargs = require('yargs').argv;
const qrcode = require('qrcode-terminal');
const fs = require('fs');

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

const base64 = {
    'lineBreak': 'ECgoK',
    'blockUp': '4paA',
    'blockDown': '4paE',
    'blockFull': '4paI',
    'whitespace': 'ICAg'
}

qrcode.generate(yargs.account, {small: true}, function (qrcode) {
    console.log(qrcode)
    // qrcode = qrcode.replace(//g,'');
    // qrcode = qrcode.replace(/\[0m/g, '');
    // qrcode = qrcode.replace(/\[47m  \[0m/g, 'ww');
    // qrcode = qrcode.replace(/\[40m  \[0m/g, '██');



// b64EncodeUnicode("▄▄▄\n\n\n   ")
// "4paE4paE4paECgoKICAg"

    let mailQrCode = `<pre style="background:black;color:white;padding:30px;">\n${qrcode}</pre>`
    // mailQrCode = new Buffer(mailQrCode).toString('base64') // base64 encode
    let textQrCode = new Buffer(qrcode).toString('base64') // base64 encode

    // Array.from(qrcode).forEach((char) => {
       
    //     switch(char) {
    //         case '▀':
    //             char = base64.blockUp;
    //             break;
    //         case '▄':
    //             char = base64.blockDown;
    //             break;
    //         case '█':
    //             char = base64.blockFull;
    //             break;
    //         case ' ':
    //             char = base64.whitespace;
    //             break;
    //         case '\n':
    //             char = base64.lineBreak;
    //             break;
    //     }

    //     textQrCode += char
    // })
    
    console.log(textQrCode)

    fs.writeFileSync('./qr.txt', qrcode)
    fs.writeFileSync('./qr-base64.txt', textQrCode)


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
        // https://nodemailer.com/message/custom-source/
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: 'bar@blurdybloop.com, baz@blurdybloop.com, pep0ni@protonmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: textQrCode, // plain text body
            html: mailQrCode, // html body
//             raw: `From: sender@example.com
// Content-Type: multipart/alternative;
//  boundary="--_NmP-9033b9271ff930df-Part_1"
// From: =?UTF-8?Q?Fred_Foo_=F0=9F=91=BB?= <foo@blurdybloop.com>
// To: bar@blurdybloop.com, baz@blurdybloop.com
// Subject: Hello =?UTF-8?Q?=E2=9C=94?=
// Message-ID: <b56a0b57-7005-4efe-d4bf-5ad90c9d9330@blurdybloop.com>
// Date: Fri, 26 Jan 2018 14:47:17 +0000
// MIME-Version: 1.0

// ----_NmP-e3af7e65a26e2087-Part_1
// Content-Type: text/html; charset=utf-8
// Content-Transfer-Encoding: base64

// ${mailQrCode}
// ----_NmP-e3af7e65a26e2087-Part_1
// Content-Type: text/plain; charset=utf-8
// Content-Transfer-Encoding: ascii

// ${qrcode}
// ----_NmP-e3af7e65a26e2087-Part_1--`
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

