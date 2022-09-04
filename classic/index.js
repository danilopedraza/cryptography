const cipherSelector = document.querySelector('.cipher-selector');


const keyInputGuide = document.querySelector('#key-input-guide');
const keyInput = document.querySelector('.input-key');


const plaintext = document.getElementById('input-plaintext');
const cipherText = document.getElementById('input-ciphertext');
const clearImage = document.getElementById('input-clearimage');
const cipherImage = document.getElementById('input-cipherimage');

const abovePlainThing = document.getElementById('above-plainthing');
const aboveCipherThing = document.getElementById('above-cipherthing');

// cambio de instrucciones y celdas dependiendo de elección del CS
cipherSelector.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'shift':
            keyInputGuide.innerHTML = 'ⓘ A key is a whole number from 1 to 26.';
            break;
        case 'substitution':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to 26 without repetitions, separated by commas.';
            break;
        case 'affine':
            keyInputGuide.innerHTML = 'ⓘ A key is a pair of numbers, both of them from 1 to 26.<br>ⓘ The first number must be invertible modulo 26.';
            break;
        case 'vigenere':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of numbers from 1 to 26, separated by commas. The numbers can be repeated.';
            break;
        case 'permutation':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of the numbers from 1 to some positive whole number without repetitions, separated by commas.';
            break;
        case 'hill':
            keyInputGuide.innerHTML = 'ⓘ A key is a list of 4, 9 or 16 numbers from 1 to 26. They can be repeated.<br>ⓘ You can separate the numbers with lines or just put them in a single line (separated by commas): they are going to be interpreted as a matrix either way. (from left to right and then from top to bottom)';
            break;
        default:
            // NOOP
            console.log('esto no debería estar pasando xddd (selector de CSs)');
            break;
    }

    if (event.target.value === 'hill') {
        keyInput.rows = '4';
        
        plaintext.style.display = 'none';
        cipherText.style.display = 'none';
        clearImage.style.display = 'block';
        cipherImage.style.display = 'block';

        abovePlainThing.innerText = 'Upload the plainimage:'
        aboveCipherThing.innerText = 'Upload the cipherimage:'
    } else {
        keyInput.rows = '1';
        
        plaintext.style.display = 'block';
        cipherText.style.display = 'block';
        clearImage.style.display = 'none';
        cipherImage.style.display = 'none';

        abovePlainThing.innerText = 'Upload the plaintext:'
        aboveCipherThing.innerText = 'Upload the ciphertext:'


    }
});
