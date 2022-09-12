import { code, occurProb, getFrecuences, getKey, digramFreq, trigramFreq, getDigramFrequences, getTrigramFrequences } from "../../cryptoanalyzers.js"
import { decodeAffine } from "../../cryptosystems.js"

const cipherText = document.getElementById('input-ciphertext')
const attackButton = document.getElementById('attack-button')
const textCompBox = document.getElementById('comparation-textbox')
const guessKeyRow = document.getElementById('guess-key-row')
const keyGuessesBox = document.getElementById('guesses')
const tryGuessButton = document.getElementById('try-guess-button')
const keyBox = document.getElementById('key')

const errorsBox = document.getElementById('errors')
const rightColumn = document.getElementById('right-column')

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
    errorsBox.innerText = ''
    cipherStr = cipherText.value
    cipherStr = cipherStr.replace(/[^a-zA-Z]/g,'').toUpperCase()
    var freqs = getFrecuences(cipherStr)
    var table = '<table><tr><th>English<th/><th>Your text<th/><tr/>'
    for (var i = 0; i < freqs.length; i++) {
        table += '<tr><th>' + occurProb[i][0] + '<th/><th>' + freqs[i][0] + '<th/><tr/>'
    }
    table += '<table/>'
    rightColumn.innerHTML = table
    
    guesses = [
        occurProb[0][0]+'->'+freqs[0][0]+','+occurProb[1][0]+'->'+freqs[1][0]
    ]

    freqs = getDigramFrequences(cipherStr)
    
    guesses.push(
        digramFreq[0][0]+'->'+freqs[0][0][0]+','+digramFreq[0][1]+'->'+freqs[0][0][1]
    )

    freqs = getTrigramFrequences(cipherStr)
    
    guesses.push(
        trigramFreq[0][0]+'->'+freqs[0][0][0]+','+trigramFreq[0][1]+'->'+freqs[0][0][1]
    )


    keyGuessesBox.innerHTML = 'Some guesses derived from frequencies:<br>' + guesses.join('<br>')
    
    guessKeyRow.style.display = 'block'
})

tryGuessButton.addEventListener('click', (event) => {
    var key = keyBox.value
    if (/^\s*((-|[a-zA-Z])\s*){26}$/.test(key)) {
        var nums = key.replace(/\s/g,'').toUpperCase().split(/->|,/)
        key = getKey([nums[0],nums[1]],[nums[2],nums[3]])
        if (key) {
            errorsBox.innerText = ''
            guessStr = decodeAffine(key, cipherStr)
            reAdjustText()
        }
        else {
            errorsBox.innerText = 'The guess resulted in a bad system of equations. A key could not be obtained.'
        }
    }
    else {
        errorsBox.innerText = 'The guess is in a bad format. It has to be two of the type X -> Y, separated by commas.'
    }
})
