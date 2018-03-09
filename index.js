'use strict'

const path = require('path')
const express = require('express')
const qrcode = require('qrcode-terminal')
const invertedQrCodeWithPadding = require('./src/invertedQrCodeWithPadding')

const PORT = process.env.PORT || 5000

const app = express()

app.get('', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('', function(req, res) {
  qrcode.generate(req.param('toConvert', ''), {small: true}, function (qrcode) {
    const qr = qrcode
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(`<pre style="background:black;color:white;padding:30px;">\n${qr}</pre>`));
  })
})

app.post('/inverted', function(req, res) {
  qrcode.generate(req.param('toConvert', ''), {small: true}, function (qrcode) {
    const qr = invertedQrCodeWithPadding(qrcode)
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(`<pre>\n${qr}</pre>`));
  })
})

app.get('/:toConvert', function (req, res) {
  qrcode.generate(req.params.toConvert, {small: true}, function (qrcode) {
    const qr = qrcode
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(qr));
  })
})

app.get('/inverted/:toConvert', function (req, res) {
  qrcode.generate(req.params.toConvert, {small: true}, function (qrcode) {
    const qr = invertedQrCodeWithPadding(qrcode)
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(qr));
  })
})

app.listen(PORT, function () {
  console.log('\x1b[32m',`Webserver listening on port ${PORT}!`,'\x1b[0m')
})
