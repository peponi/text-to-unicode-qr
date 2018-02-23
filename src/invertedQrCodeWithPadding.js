const invertQrCode = require('./invertQrCode')

const PADDING_VERTICAL = 10
const PADDING_HORIZONTAL = PADDING_VERTICAL / 2
const PADDING_FILLER = '█'
const LINE_BREAKER = '\n'

const invertedQrCodeWithPadding = (qrcode) => {
    const str = invertQrCode(qrcode)

    const qrCodeLineLength = qrcode.indexOf('\n')
    const qrCodeLengthWithPadding = (PADDING_VERTICAL * 2) + qrCodeLineLength
    let strWithPadding = ''

    for (let currentLineIndex = 0; currentLineIndex < PADDING_HORIZONTAL; currentLineIndex++) {
        strWithPadding += ''.padStart(qrCodeLengthWithPadding, PADDING_FILLER)
        strWithPadding += LINE_BREAKER        
    }

    const splitStr = str.split('\n')
    const splitStrLength = splitStr.length - 1 // because there is one \n to much on the end

    for (var i = 0; i < splitStrLength; i++) {
        strWithPadding += ''.padStart(PADDING_VERTICAL, PADDING_FILLER)
        strWithPadding += splitStr[i]
        strWithPadding += ''.padStart(PADDING_VERTICAL, PADDING_FILLER)
        strWithPadding += LINE_BREAKER
    }

    for (let currentLineIndex = 0; currentLineIndex < PADDING_HORIZONTAL; currentLineIndex++) {
        strWithPadding += ''.padStart(qrCodeLengthWithPadding, PADDING_FILLER)
        strWithPadding += LINE_BREAKER        
    }

    return strWithPadding
}

module.exports = invertedQrCodeWithPadding
