const cipherSelector = document.querySelector('.cipher-selector')


const keyInputGuide = document.querySelector('#key-input-guide')
const keyInput = document.querySelector('.input-key')


const plaintext = document.getElementById('input-plaintext')
const cipherText = document.getElementById('input-ciphertext')
const clearImage = document.getElementById('input-clearimage')
const cipherImage = document.getElementById('input-cipherimage')

const abovePlainThing = document.getElementById('above-plainthing')
const aboveCipherThing = document.getElementById('above-cipherthing')

// cambio de instrucciones y celdas dependiendo de elección del CS
cipherSelector.addEventListener('change', (event) => {
    keyInput.value = ''

    switch (event.target.value) {
        case 'shift':
            keyInputGuide.innerHTML = 'ⓘ A key is a whole number from 1 to 26.'
            break
        case 'substitution':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to 26 without repetitions, separated by commas.'
            break
        case 'affine':
            keyInputGuide.innerHTML = 'ⓘ A key is a pair of numbers, both of them from 1 to 26.<br>ⓘ The first number must be invertible modulo 26.'
            break
        case 'vigenere':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of numbers from 1 to 26, separated by commas. The numbers can be repeated.'
            break
        case 'permutation':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to some positive whole number without repetitions, separated by commas.'
            break
        case 'hill':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of 4, 9 or 16 numbers from 1 to 256. They can be repeated.<br>ⓘ You can separate the numbers with lines or just put them in a single line (separated by commas): they are going to be interpreted as a matrix either way.'
            break
        default:
            // NOOP
            console.log('esto no debería estar pasando xddd (selector de CSs)')
            break
    }

    if (event.target.value === 'hill') {
        keyInput.rows = '4'
        
        plaintext.style.display = 'none'
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
        
        plaintext.style.display = 'block'
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
    switch (cipherSelector.value) {
        case 'shift':
            keyInput.value = randint(1,26+1).toString()
            break
        case 'substitution':
            availableNums = Array.from({length: 26}, (_, i) => i + 1)
            res = Array.from({length: 26}, () => availableNums.splice(randint(0,availableNums.length),1)[0])
            keyInput.value = res.join()
            break
        case 'affine':
            phiOf26 = [1,3,5,7,9,11,15,17,19,21,23,25]
            i = randint(0,phiOf26.length)
            keyInput.value = [phiOf26[i], randint(1,26+1)].join()
            break
        case 'vigenere':
            keyLength = randint(5,20+1)
            keyInput.value = Array.from({length: keyLength}, () => randint(1,26+1).toString()).join()
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
                () => Array.from({length: keyLength}, () => randint(1,256+1)).join()
            )
            keyInput.value = res.join('\n')
            break
        default:
            // NOOP
            console.log('esto no debería estar pasando xddd (random key button)')
            break
    }
})
