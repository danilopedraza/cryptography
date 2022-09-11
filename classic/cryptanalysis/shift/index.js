import {
    code,
    occurProb, 
    getFrecuences } from "../../cryptoanalyzers.js"


import { decodeShift } from "../../cryptosystems.js"

const cipherText = document.getElementById('input-ciphertext')
const attackButton = document.getElementById('attack-button')

const textCompBox = document.getElementById('comparation-textbox')

const guessKeyRow = document.getElementById('guess-key-row')
const keyBox = document.getElementById('key')

const keyGuessesBox = document.getElementById('guesses')

const tryKeyButton = document.getElementById('try-key-button')
const prevKeyButton = document.getElementById('previous-key-button')
const nextKeyButton = document.getElementById('next-key-button')

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
    
    var guesses = new Set()
    for (var i = 0; i < 3; i++) {
        var guess = code(freqs[i][0]) - code(occurProb[i][0])
        if (guess < 0) guess += 26
        guess = String.fromCharCode(65+guess)
        guesses.add(guess)
    }

    guesses = Array.from(guesses).join(', ')

    if (guesses.length == 1)
        keyGuessesBox.innerText = 'A guess derived from frequencies: ' + guesses
    else
        keyGuessesBox.innerText = 'Some guesses derived from frequencies: ' + guesses
    
    guessKeyRow.style.display = 'block'

    keyBox.value = guesses[0]

    guessStr = decodeShift(code(guesses[0]), cipherStr)
    reAdjustText()
})

tryKeyButton.addEventListener('click', (event) => {
    var key = keyBox.value
    if (/^[a-zA-Z]$/.test(key)) {
        guessStr = decodeShift(code(key), cipherStr)
        reAdjustText()
    }
    else {
        // TODO: manejar error
    }
})

nextKeyButton.addEventListener('click', (event) => {
    var key = keyBox.value
    key = String.fromCharCode(65+(code(key)+1) % 26)
    keyBox.value = key
    if (/^[a-zA-Z]$/.test(key)) {
        guessStr = decodeShift(code(key), cipherStr)
        reAdjustText()
    }
    else {
        // TODO: manejar error
    }
})

prevKeyButton.addEventListener('click', (event) => {
    var key = keyBox.value
    key = String.fromCharCode(65+(26+(code(key)-1)) % 26)
    keyBox.value = key
    if (/^[a-zA-Z]$/.test(key)) {
        guessStr = decodeShift(code(key), cipherStr)
        reAdjustText()
    }
    else {
        // TODO: manejar error
    }
})
