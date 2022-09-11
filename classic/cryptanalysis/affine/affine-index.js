import { code, occurProb, getFrecuences, getKey, digramFreq, TrigramFreq } from "../../cryptoanalyzers.js"

const cipherText = document.getElementById('input-ciphertext')
const attackButton = document.getElementById('attack-button')
const textCompBox = document.getElementById('comparation-textbox')
const guessKeyRow = document.getElementById('guess-key-row')
const keyGuessesBox = document.getElementById('guesses')
const tryGuessButton = document.getElementById('try-guess-button')
const keyBox = document.getElementById('key')

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


attackButton.addEventListener('click', (event) => {
    cipherStr = cipherText.value
    cipherStr = cipherStr.replace(/[^a-zA-Z]/g,'').toUpperCase()
    var freqs = getFrecuences(cipherStr)
    
    guesses = [
        occurProb[0][0]+'->'+freqs[0][0]+','+occurProb[1][0]+'->'+freqs[1][0]
    ]

    keyGuessesBox.innerText = 'A guess derived from frequencies: ' + guesses
    
    guessKeyRow.style.display = 'block'
})

tryGuessButton.addEventListener('click', (event) => {
    var key = keyBox.value
    if (/^(\s*[a-zA-Z]\s*->\s*[a-zA-Z]\s*),(\s*[a-zA-Z]\s*->\s*[a-zA-Z]\s*)$/.test(key)) {
        var nums = key.replace(/\s/g,'').toUpperCase().split(/->|,/).map(code)
        key = getKey([nums[0],nums[1]],[nums[2],nums[3]])
        guessStr = decodeShift(code(key), cipherStr)
        reAdjustText()
    }
    else {
        // TODO: manejar error
    }
})

