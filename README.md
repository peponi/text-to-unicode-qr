## I try to send emails with text based qr codes

start ```npm run start:maildev```

send a mail with an Bitcoin address as QR code
```node index.js --account 113HP53P3Tcr3BNgjfWHujntdWm3ywCrWa```

goto ```http://0.0.0.0:1080/#/```


## FYI

* need to find out how to format the qr code for 'quoted-printable'
* black on white letters dosn't work -> white on black works, so I need to invert the ascii qr