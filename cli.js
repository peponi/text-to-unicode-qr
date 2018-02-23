'use strict'

const fs = require('fs')
const yargs = require('yargs').argv
const qrcode = require('qrcode-terminal')
const invertedQrCodeWithPadding = require('./src/invertedQrCodeWithPadding')

qrcode.generate(yargs.convertThis, {small: true}, function (qrcode) {

  let qr = yargs.inverted ? invertedQrCodeWithPadding(qrcode) : qrcode
  console.log(qr,'\n',yargs.convertThis,'\n')
  
  if(yargs.file) {
    const fileName = typeof yargs.file === 'string' ? yargs.file : `qr${yargs.inverted && '-inverted' || ''}`
    fs.writeFileSync(`./${fileName}.txt`, qr)
  }
})
