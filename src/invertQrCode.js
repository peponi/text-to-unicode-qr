const invertQrCode = (qrcode) => {
    const LINE_BREAKER = '\n'
    const qrCodeLineLength = qrcode.indexOf('\n')
    const invert = {
        '█': ' ',
        '▄': '▀',
        '▀': '▄',
        ' ': '█'
    }

    let invertedQrCode = ''
    let currentLineIndex = 0
    let qrCodeLineCount = 0

    for (var i = 0; i < qrcode.length; i++) {
        invertedQrCode += invert[qrcode[i]]

        if (currentLineIndex === qrCodeLineLength) {
            invertedQrCode += LINE_BREAKER
            currentLineIndex = 0
            qrCodeLineCount ++
        } else {
            currentLineIndex++
        }
    }

    // don't know where the undefined comes from
    return invertedQrCode.replace(new RegExp('undefined', 'g'), '')
}

module.exports = invertQrCode
