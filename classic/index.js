import * as cryptosystems from './cryptosystems.js'


const cipherSelector = document.querySelector('.cipher-selector')


const keyInputGuide = document.querySelector('#key-input-guide')
const keyErrors = document.getElementById('errors')
const keyInput = document.querySelector('.input-key')


const plainText = document.getElementById('input-plaintext')
const cipherText = document.getElementById('input-ciphertext')
const clearImage = document.getElementById('input-clearimage')
const cipherImage = document.getElementById('input-cipherimage')

const abovePlainThing = document.getElementById('above-plainthing')
const aboveCipherThing = document.getElementById('above-cipherthing')

// cambio de instrucciones y celdas dependiendo de elección del CS
cipherSelector.addEventListener('change', (event) => {
    keyInput.value = ''
    keyErrors.innerHTML = ''

    switch (event.target.value) {
        case 'shift':
            keyInputGuide.innerHTML = 'ⓘ A key is a whole number from 0 to 25.'
            break
        case 'substitution':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to 26 without repetitions, separated by commas.'
            break
        case 'affine':
            keyInputGuide.innerHTML = 'ⓘ A key is a pair of numbers, both of them from 0 to 25.<br>ⓘ The first number must be invertible modulo 26.'
            break
        case 'vigenere':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of numbers from 0 to 25, separated by commas. The numbers can be repeated.'
            break
        case 'permutation':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to some positive whole number without repetitions, separated by commas.'
            break
        case 'hill':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of 4, 9 or 16 numbers from 0 to 255. They can be repeated.<br>ⓘ You can separate the numbers with lines or just put them in a single line (separated by commas): they are going to be interpreted as a matrix either way.'
            break
        default:
            // NOOP
            console.log('esto no debería estar pasando xddd (selector de CSs)')
            break
    }

    if (event.target.value === 'hill') {
        keyInput.rows = '4'
        
        plainText.style.display = 'none'
        cipherText.style.display = 'none'
        clearImage.style.display = 'block'
        cipherImage.style.display = 'block'

        abovePlainThing.innerText = 'Upload the plainimage:'
        aboveCipherThing.innerText = 'Upload the cipherimage:'
    } else {
        if (event.target.value === 'substitution')
            keyInput.rows = '2' 
        else    
            keyInput.rows = '1'
        
        plainText.style.display = 'block'
        cipherText.style.display = 'block'
        clearImage.style.display = 'none'
        cipherImage.style.display = 'none'

        abovePlainThing.innerText = 'Enter the plaintext:'
        aboveCipherThing.innerText = 'Enter the ciphertext:'
    }
})


function randint(a, b) {
    return a+Math.floor(Math.random()*(b-a))
}


const randomKeyButton = document.querySelector('.random-key-button')
randomKeyButton.addEventListener('click', (event) => {
    var availableNums, res, phiOf26, i, keyLength
    switch (cipherSelector.value) {
        case 'shift':
            keyInput.value = randint(0,26).toString()
            break
        case 'substitution':
            availableNums = Array.from({length: 26}, (_, i) => i + 1)
            res = Array.from({length: 26}, () => availableNums.splice(randint(0,availableNums.length),1)[0])
            keyInput.value = res.join()
            break
        case 'affine':
            phiOf26 = [1,3,5,7,9,11,15,17,19,21,23,25]
            i = randint(0,phiOf26.length)
            keyInput.value = [phiOf26[i], randint(0,26)].join()
            break
        case 'vigenere':
            keyLength = randint(5,20+1)
            keyInput.value = Array.from({length: keyLength}, () => randint(0,26).toString()).join()
            break
        case 'permutation':
            keyLength = randint(5,20+1)
            availableNums = Array.from({length: keyLength}, (_, i) => i + 1)
            res = Array.from({length: keyLength}, () => availableNums.splice(randint(0,availableNums.length),1)[0])
            keyInput.value = res.join()
            break
        case 'hill':
            keyLength = randint(2,4+1)
            res = Array.from(
                {length: keyLength},
                () => Array.from({length: keyLength}, () => randint(0,256)).join()
            )
            keyInput.value = res.join('\n')
            break
        default:
            // NOOP
            console.log('esto no debería estar pasando xddd (random key button)')
            break
    }
})

// verificación de las claves
function verifyKey() {
    var key = null
    var errors = []
    var warnings = []
    switch (cipherSelector.value) {
        case 'shift':
            key = keyInput.value
            if (/^([0-9]|[1-9][0-9]+)$/.test(key)) {
                key = parseInt(key)
                
                if (0 <= key && key <= 25) {
                    // NOOP: clave buena
                }
                else {
                    // número fuera de representantes principales
                    warnings.push('The key is a number, but is not between 0 and 25. It is going to be taken modulo 26.')
                }
                
                key = key % 26
            }
            else {
                errors.push('The submitted key either is not a whole positive number, or has leading zeros.')
            }
            break
        case 'substitution':
            key = keyInput.value

            if (/^(([1-9]|1[0-9]|2[0-6])\s*,\s*)*([1-9]|1[0-9]|2[0-6])$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = key.split(/,/)
                console.log(key)
                key = key.map(Number)
                if (JSON.stringify([...key].sort((a,b)=>a-b)) == JSON.stringify(Array.from({length: 26}, (_, i) => i + 1))) {
                    // NOOP: clave buena
                }
                else {
                    errors.push('The key has missing, repeated or unnecessary elements.')
                }
            }
            else {
                errors.push('The key must be composed of numbers (from 1 to 26) separated by commas.')
            }
            break
        case 'affine':
            key = keyInput.value

            if (/^(([0-9]|1[0-9]|2[0-5])\s*,\s*)([0-9]|1[0-9]|2[0-5])$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = key.split(/,/)
                
                key = key.map(Number)
                var gcd = function(a,b) { return (!b)? a:gcd(b,a%b) }
                if (gcd(key[0],26)==1) {
                    // NOOP: clave buena
                }
                else {
                    errors.push('The first element of the key is not invertible modulo 26.')
                }
            }
            else {
                errors.push('The key must be composed of two numbers (from 0 to 25) separated by commas.')
            }
            break
        case 'vigenere':
            key = keyInput.value

            if (/^(([0-9]|1[0-9]|2[0-5])\s*,\s*)*([0-9]|1[0-9]|2[0-5])$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = key.split(/,/)
                key = key.map(Number) // clave buena
            }
            else {
                errors.push('The key must be composed of numbers (from 0 to 25) separated by commas.')
            }
            
            break
        case 'permutation':
            key = keyInput.value

            if (/^(([1-9]|1[0-9]|2[0-6])\s*,\s*)*([1-9]|1[0-9]|2[0-6])$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = key.split(/,/)

                key = key.map(Number)
                if (JSON.stringify([...key].sort((a,b)=>a-b)) == JSON.stringify(Array.from({length: key.length}, (_, i) => i + 1))) {
                    // NOOP: clave buena
                }
                else {
                    errors.push('The key has missing, repeated or unnecessary elements.')
                }
            }
            else {
                errors.push('The key must be composed of different numbers (from 1 to some positive number) separated by commas.')
            }

            break
        default: // no puede ser hill
            break
    }
    
    errors = Array.from(errors, text => 'Error: ' + text)
    warnings = Array.from(warnings, text => 'Warning: ' + text)
    
    keyErrors.innerHTML = errors.concat(warnings).join('<br>')

    if (errors.length == 0)
        return key
    return null
}


const cipherButton = document.getElementById('start-cipher')

cipherButton.addEventListener('click' ,(event) => {
    if (cipherSelector.value != 'hill') {
        var key = verifyKey()
        if (key == null) {
            // NOOP: verifyKey ya hizo lo necesario
        }
        else {
            var inputStr = plainText.value.replace(/[^a-zA-Z]/g, '').toUpperCase()
            var outputStr = ''
            switch (cipherSelector.value) {
                case 'shift':
                    outputStr = cryptosystems.encodeShift(key, inputStr)
                    break
                case 'substitution':
                    outputStr = cryptosystems.encodePermutation(key, inputStr)
                    break
                case 'affine':
                    outputStr = cryptosystems.encodeAffine(key, inputStr)
                    break
                case 'vigenere':
                    outputStr = cryptosystems.encodeVigenere(key, inputStr)
                    break
                case 'permutation':
                    outputStr = cryptosystems.encodePermutation(key, inputStr)
                    break
                default:
                    break
            }
            cipherText.value = outputStr
        }
    }
    else {
        // TODO: procesar hill
    }
    
})


const decipherButton = document.getElementById('start-decipher')

decipherButton.addEventListener('click' ,(event) => {
    if (cipherSelector.value != 'hill') {
        var key = verifyKey()
        if (key == null) {
            // NOOP: verifyKey ya hizo lo necesario
        }
        else {
            var inputStr = cipherText.value.replace(/[^a-zA-Z]/g, '').toUpperCase()
            var outputStr = ''
            switch (cipherSelector.value) {
                case 'shift':
                    outputStr = cryptosystems.decodeShift(key, inputStr)
                    break
                case 'substitution':
                    outputStr = cryptosystems.decodePermutation(key, inputStr)
                    break
                case 'affine':
                    outputStr = cryptosystems.decodeAffine(key, inputStr)
                    break
                case 'vigenere':
                    outputStr = cryptosystems.decodeVigenere(key, inputStr)
                    break
                case 'permutation':
                    outputStr = cryptosystems.decodePermutation(key, inputStr)
                    break
                default:
                    break
            }
            plainText.value = outputStr
        }
    }
    else {
        // TODO: procesar hill
    }
})
