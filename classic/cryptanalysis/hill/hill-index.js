import { analyzeHill } from "../../cryptoanalyzers.js"

const plainText = document.getElementById('input-plaintext')
const cipherText = document.getElementById('input-ciphertext')

const attackButton = document.getElementById('attack-button')

const noGuessButton = document.getElementById('no-guess')
const theKeyButton = document.getElementById('the-key')

const keyGuessesBox = document.getElementById('key-guesses')
const keyBoxGuide = document.getElementById('key-box-guide')

const errorsBox = document.getElementById('errors')

const resultsBox = document.getElementById('results')

noGuessButton.addEventListener('click', (event) => {
    keyGuessesBox.style.display = 'none'
    keyBoxGuide.innerText = ''
})

theKeyButton.addEventListener('click', (event) => {
    keyGuessesBox.style.display = 'block'
    keyBoxGuide.innerHTML = 'Enter the length. It must be a whole number between 2 and 4. You must provide enough text to solve the correspondent system.<br>More precisely, you will need at least n² characters of text to possibly get a key of length n.'
})


attackButton.addEventListener('click', (event) => {
    errorsBox.innerHTML = ''

    var plain = plainText.value.replace(/[^a-zA-Z]/g,'').toUpperCase()
    var cipher = cipherText.value.replace(/[^a-zA-Z]/g,'').toUpperCase()

    if (plain.length == cipher.length) {
        var keys = null
        var lengths = []
        if (noGuessButton.checked) {
            if (plain.length >= 4)
                lengths.push(2)
            if (plain.length >= 9)
                lengths.push(3)
            if (plain.length >= 16)
                lengths.push(4)
            
            keys = analyzeHill(plain, cipher, lengths)
        }
        else if (theKeyButton.checked) {
            var key = keyGuessesBox.value
            if (/^\s*[2-4]\s*$/.test(key)) {
                key = Number(key.replace(/\s/g, ''))

                if (plain.length < key*key) {
                    errorsBox.innerText = 'Error: The text is not long enough. For your key, it must have at least ' + key*key + ' characters.'
                }
                else {
                    keys = analyzeHill(plain, cipher, [key])
                }                
            }
            else {
                errorsBox.innerText = 'The entered key length is not a number between 2 and 4.'
            }
        }
        else {
            // NOOP
            console.log('inaccesible')
        }
    }
    else {
        errorsBox.innerText = 'Error: After removing illegal characters, the plaintext and the ciphertext have different lengths. The analysis cannot be done.'
    }

    if (keys) {
        switch (keys.length) {
            case 0:
                resultsBox.innerHTML = 'We did not found any key. However, we did not try with every possible option (unless you provided the minimum amount of text required). Try to isolate pairs of plaintext and ciphertext, and see if they return a key!'
                break
            case 1:
                resultsBox.innerHTML = 'We found a key:<br>'+keys[0].join()
                break
            default:
                var text = 'We found some keys:'
                keys.forEach(key => text += '<br>' + key.join())
                break
        }
    }
    else {
        // NOOP: hubo un error y ya se notificó
    }
})
