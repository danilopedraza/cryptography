import * as cryptosystems from './cryptosystems.js'
import * as matrix from './matrix.js'

const cipherSelector = document.querySelector('.cipher-selector')


const keyInputGuide = document.querySelector('#key-input-guide')
const keyErrors = document.getElementById('errors')
const keyInput = document.querySelector('.input-key')


const plainText = document.getElementById('input-plaintext')
const cipherText = document.getElementById('input-ciphertext')
const plainImage = document.getElementById('input-plainimage')
const cipherImage = document.getElementById('input-cipherimage')

const abovePlainThing = document.getElementById('above-plainthing')
const aboveCipherThing = document.getElementById('above-cipherthing')

const imageText = document.getElementById('image-text')
const outputCanvas = document.getElementById('output-image')

// cambio de instrucciones y celdas dependiendo de elección del CS
cipherSelector.addEventListener('change', (event) => {
    keyInput.value = ''
    keyErrors.innerHTML = ''

    switch (event.target.value) {
        case 'shift':
            keyInputGuide.innerHTML = 'ⓘ A key is an english letter.'
            break
        case 'substitution':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of all the english letters without repetitions.'
            break
        case 'affine':
            keyInputGuide.innerHTML = 'ⓘ A key is a pair of numbers, both of them from 0 to 25.<br>ⓘ The first number must be invertible modulo 26.'
            break
        case 'vigenere':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of english letters. The letters can be repeated.'
            break
        case 'permutation':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to some positive whole number without repetitions, separated by commas.'
            break
        case 'hill':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of 4, 9 or 16 numbers from 0 to 255. They can be repeated.<br>ⓘ You can separate the numbers with lines or just put them in a single line (separated by commas): they are going to be interpreted as a matrix either way. The matrix must be invertible modulo 256.'
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
        plainImage.style.display = 'block'
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
        plainImage.style.display = 'none'
        cipherImage.style.display = 'none'

        abovePlainThing.innerText = 'Enter the plaintext:'
        aboveCipherThing.innerText = 'Enter the ciphertext:'
        
        imageText.innerText = ''
        outputCanvas.width = 0
        outputCanvas.height = 0
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
            keyInput.value = String.fromCharCode(65+randint(0,26))
            break
        case 'substitution':
            availableNums = Array.from({length: 26}, (_, i) => String.fromCharCode(65+i))
            res = Array.from({length: 26}, () => availableNums.splice(randint(0,availableNums.length),1)[0])
            keyInput.value = res.join('')
            break
        case 'affine':
            phiOf26 = [1,3,5,7,9,11,15,17,19,21,23,25]
            i = randint(0,phiOf26.length)
            keyInput.value = [phiOf26[i], randint(0,26)].join()
            break
        case 'vigenere':
            keyLength = randint(5,20+1)
            keyInput.value = Array.from({length: keyLength}, () => String.fromCharCode(65+randint(0,26))).join('')
            break
        case 'permutation':
            keyLength = randint(5,20+1)
            availableNums = Array.from({length: keyLength}, (_, i) => i + 1)
            res = Array.from({length: keyLength}, () => availableNums.splice(randint(0,availableNums.length),1)[0])
            keyInput.value = res.join()
            break
        case 'hill':
            do {
                keyLength = randint(2,4+1)
                res = Array.from(
                    {length: keyLength},
                    () => Array.from({length: keyLength}, () => randint(0,256)).join()
                )
                res = res.join('\n')
                var key = res.split(/\n|,/)
            } while(!matrix.invertible(matrix.arrayToMatrix(key)));
            keyInput.value = res
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
            if (/^\s*[a-zA-Z]\s*$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = key.toUpperCase().charCodeAt(0)-65
            }
            else {
                errors.push('The submitted key is not an english letter')
            }
            break
        case 'substitution':
            key = keyInput.value

            if (/^\s*([a-zA-Z]\s*){26}$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = Array.from(key.toUpperCase())
                key = Array.from(key, char => char.charCodeAt(0)-65+1)
                if (JSON.stringify([...key].sort((a,b)=>a-b)) == JSON.stringify(Array.from({length: 26}, (_, i) => i + 1))) {
                    // NOOP: clave buena
                }
                else {
                    errors.push('The key has missing, repeated or unnecessary elements.')
                }
            }
            else {
                errors.push('The key must be composed of the 26 english letters without repetitions.')
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

            if (/^\s*([a-zA-Z]\s*)+$/.test(key)) {
                key = key.replace(/\s/g, '')
                key = Array.from(key.toUpperCase())
                key = Array.from(key, char => char.charCodeAt(0)-65)
                key = key.map(Number) // clave buena
            }
            else {
                errors.push('The key must be a word in the english alphabet.')
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
        case 'hill':
            key = keyInput.value
            //key = key.replace(/\s/g, '')
            key = key.split(/\n|,/)
            
            if (key.some((str) => !/[0-9]|[1-9][0-9]+/.test(str))) {
                errors.push('The key must be composed of numbers separated by commas or lines.')
            }
            else {
                
                if (key.length == 4 || key.length == 9 || key.length == 16) {
                    key = key.map(Number)
                    if(!matrix.invertible(matrix.arrayToMatrix(key))) {
                        errors.push('The matrix is not invertible.')
                    }
                }
                else {
                    errors.push('Due to its size, the entered key cannot be interpreted as a matrix.')
                }
            }
            break
        default:
            break
    }
    
    errors = Array.from(errors, text => 'Error: ' + text)
    warnings = Array.from(warnings, text => 'Warning: ' + text)
    
    keyErrors.innerHTML = errors.concat(warnings).join('<br>')

    if (errors.length == 0)
        return key
    return null
}

function imageToArray(img) {
    var c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    var ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    var idata = ctx.getImageData(0, 0, img.width, img.height)
    var arr = new Uint8ClampedArray(idata.data.length/4)
    for (var i = 0; i < arr.length; i++)
        arr[i] = Math.floor((idata.data[4*i]+idata.data[4*i+1]+idata.data[4*i+2])/3)
    
    return arr
}

function verifyAndSendImage(mode, key) {
    if (!(mode == 'decipher' || mode == 'cipher'))
        return undefined
    
    var file
    if (mode == 'cipher')
        file = document.getElementById('input-plainimage')
    else // mode == 'decipher'
        file = document.getElementById('input-cipherimage')
    
    
    
    if (file.files.length == 0) {
        // TODO: avisar de error, no hay imagen
        return null
    }
    else {
        file = file.files[0]
        const fileURL = URL.createObjectURL(file)
        var img = new Image()
        img.src = fileURL

        img.addEventListener('load', (event) => {
            var arr = imageToArray(event.target)
            
            if (mode == 'cipher')
                arr = cryptosystems.encodeHill(key, arr)
            else
                arr = cryptosystems.decodeHill(key, arr)
            var imgData = new Uint8ClampedArray(arr.length*4)
            for (var i = 0; i < arr.length; i++) {
                imgData[4*i] = arr[i]
                imgData[4*i+1] = arr[i]
                imgData[4*i+2] = arr[i]
                imgData[4*i+3] = 255
            }
            var canvasData = new ImageData(imgData, img.width, img.height)
            outputCanvas.height = img.height
            outputCanvas.width = img.width
            var ctx = outputCanvas.getContext('2d')

            if (mode == 'cipher')
                imageText.innerText = 'Ciphered image:'
            else
                imageText.innerText = 'Deciphered image:'

            ctx.putImageData(canvasData, 0, 0)
        })
    }
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
                    outputStr = cryptosystems.encodeSubstitution(key, inputStr)
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
        var key = verifyKey()
        if (key == null) {
            // NOOP: verifyKey ya hizo lo necesario
        }
        else {
            verifyAndSendImage('cipher', key)
        }
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
                    outputStr = cryptosystems.decodeSubstitution(key, inputStr)
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
        var key = verifyKey()
        if (key == null) {
            // NOOP: verifyKey ya hizo lo necesario
        }
        else {
            verifyAndSendImage('decipher', key)
        }
    }
})
