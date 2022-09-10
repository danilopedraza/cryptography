const cipherText = document.getElementById('input-ciphertext')
const attackButton = document.getElementById('attack-button')

const textCompBox = document.getElementById('comparation-textbox')

var guessStr =  ''
var cipherStr = ''

function getCharWidth() {
    return 10
}

function getBoxWidth() {
    return textCompBox.offsetWidth
}


function reAdjustText() {
    var charWidth = getCharWidth()
    var boxWidth = getBoxWidth()

    var charsPerLine = Math.floor(boxWidth / charWidth) - 1

    var resStr = ''

    for (var i = 0; i < guessStr.length; i+=charsPerLine) {
        var end
        if (guessStr.length < i + charsPerLine)
            end = guessStr.length
        else
            end = i + charsPerLine
        
        resStr += guessStr.substring(i, end) + '<br>' + cipherStr.substring(i, end) + '<br><br>'
    }

    textCompBox.innerHTML = resStr
}

reAdjustText()