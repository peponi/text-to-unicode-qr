'use strict'

const path = require('path')
const express = require('express')
const qrcode = require('qrcode-terminal')
const invertedQrCodeWithPadding = require('./src/invertedQrCodeWithPadding')

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
    res.send(new Buffer(`<pre style="background:black;color:white;padding:30px;">\n${qr}</pre>`));
  })
})

app.get('/inverted/:toConvert', function (req, res) {
  qrcode.generate(req.params.toConvert, {small: true}, function (qrcode) {
    const qr = invertedQrCodeWithPadding(qrcode)
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(`<pre>\n${qr}</pre>`));
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
