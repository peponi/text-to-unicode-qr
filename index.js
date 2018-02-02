'use strict';
const nodemailer = require('nodemailer');
const yargs = require('yargs').argv;
const qrcode = require('qrcode-terminal');
const quotedPrintable = require('quoted-printable')
const utf8 = require('utf8')
const fs = require('fs');

const invert = {
    '█': ' ',
    '▄': '▀',
    '▀': '▄',
    ' ': '█'
}
const paddingVertical = 10
const paddingHorizontal = paddingVertical / 2
const paddingFiller = '█'
const lineBreaker = '\n'

const invertQrCode = (qrcode) => {
    const qrCodeLineLength = qrcode.indexOf('\n')
    let invertedQrCode = ''
    let currentLineIndex = 0
    let qrCodeLineCount = 0

    for (var i = 0; i < qrcode.length; i++) {
        invertedQrCode += invert[qrcode[i]]

        if (currentLineIndex === qrCodeLineLength) {
            invertedQrCode += lineBreaker
            currentLineIndex = 0
            qrCodeLineCount ++
        } else {
            currentLineIndex++
        }

    }

    // don't know where the undefined comes from
    invertedQrCode = invertedQrCode.replace(new RegExp('undefined', 'g'), '')

    return invertedQrCode
}

const invertedQrCodeWithPadding = (qrcode) => {
    const str = invertQrCode(qrcode)

    const qrCodeLineLength = qrcode.indexOf('\n')
    const qrCodeLengthWithPadding = (paddingVertical * 2) + qrCodeLineLength
    let strWithPadding = ''

    for (let currentLineIndex = 0; currentLineIndex < paddingHorizontal; currentLineIndex++) {
        strWithPadding += ''.padStart(qrCodeLengthWithPadding, '█')
        strWithPadding += lineBreaker        
    }

    const splitStr = str.split('\n')
    const splitStrLength = splitStr.length - 1 // because there is one \n to much on the end

    for (var i = 0; i < splitStrLength; i++) {
        strWithPadding += ''.padStart(paddingVertical, '█')
        strWithPadding += splitStr[i]
        strWithPadding += ''.padStart(paddingVertical, '█')
        strWithPadding += lineBreaker
    }

    for (let currentLineIndex = 0; currentLineIndex < paddingHorizontal; currentLineIndex++) {
        strWithPadding += ''.padStart(qrCodeLengthWithPadding, '█')
        strWithPadding += lineBreaker        
    }

    return strWithPadding
}


qrcode.generate(yargs.account, {small: true}, function (qrcode) {
    // qrcode = qrcode.replace(//g,'');
    // qrcode = qrcode.replace(/\[0m/g, '');
    // qrcode = qrcode.replace(/\[47m  \[0m/g, 'ww');
    // qrcode = qrcode.replace(/\[40m  \[0m/g, '██');

    console.log(qrcode)

    let mailQrCode = `<pre style="background:black;color:white;padding:30px;">\n${qrcode}</pre>`
    // mailQrCode = new Buffer(mailQrCode).toString('base64') // base64 encode
    // let base64QrCode = new Buffer(qrcode).toString('base64') // base64 encode
    let textQrCode = invertedQrCodeWithPadding(qrcode)
    
    console.log(textQrCode)

    fs.writeFileSync('./qr.txt', qrcode)
    fs.writeFileSync('./qr-plain.txt', textQrCode)


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

        // textQrCode = new Buffer(textQrCode).toString('base64') // base64 encode
        textQrCode = quotedPrintable.encode(utf8.encode(textQrCode));

        // setup email data with unicode symbols
        // https://nodemailer.com/message/custom-source/
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
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
Content-Type: text/plain;
Content-Transfer-Encoding: quoted-printable

${textQrCode}
----_NmP-e3af7e65a26e2087-Part_1--`

// ----_NmP-e3af7e65a26e2087-Part_1
// Content-Type: text/html; charset=utf-8
// Content-Transfer-Encoding: base64

// ${mailQrCode}
// ----_NmP-e3af7e65a26e2087-Part_1
// Content-Type: text/plain; charset=utf-8
// Content-Transfer-Encoding: ascii

// ${textQrCode}
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
});
