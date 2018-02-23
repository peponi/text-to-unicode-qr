> I try to send emails with text based qr codes 'cause my friends only receive plain text mails,
> but for everyone who could use this crap, I create CLI and web API &
> will host this on HEROKU later (unit tests mssing)

NOT FINISHED YET !!

## Usage email

#### QR code via plain text email

![screenshot of an html email with text based QR code](./assets/screenshot-text.png)

#### QR code via HTML email

![screenshot of an html email with text based QR code](./assets/screenshot-html.png)

start ```npm run start:maildev```

send a mail with an Bitcoin address as QR code
```node index.js --convertThis 113HP53P3Tcr3BNgj8WHujntdWm3ywCrWa```

goto ```http://0.0.0.0:1080/#/```

## Usage Express WebServer

#### request qr code via API

![screenshot of chrome brower which returned a unicode QR code for request on default api path](./assets/screenshot-browser.png)

#### request inverted qr code via API

![screenshot of chrome brower which returned a inverted unicode QR code for request on /inverted api path](./assets/screenshot-browser-inverted.png)

|API|description|
|---|---|
|/|will return the index.html with input form to convert strings|
|/VALUE|will return the converted VALUE as qr|
|/inverted/VALUE|will return the inverted VALUE as qr|

## Usage CLI

#### request inverted qr code on command line

![screenshot of terminal which returned a inverted unicode QR code](./assets/screenshot-cli.png)

|argument|description|
|---|---|
|--convertThis|text to be converted|
|--inverted|will invert the qr code|
|--file|will save the qr code in a qr.txt file|
|--file=<VALUE>|will save the qr code in a file named with <VALUE>.txt|

will the converted unicode qr in terminal

```
node ./cli.js --convertThis=sadfsdfdfdsfghjre65zrtezht54e
```

will save a unicode qr in ```./qr.txt```

```
node ./cli.js --convertThis=sadfsdfdfdsfghjre65zrtezht54e --file
```

will save a inverted unicode qr in ```./wurstbrot.txt```

```
node ./cli.js --convertThis=sadfsdfdfdsfghjre65zrtezht54e --inverted --file=wurstbrot
```

## TODO

* need to find out how to format the qr code for 'quoted-printable'
