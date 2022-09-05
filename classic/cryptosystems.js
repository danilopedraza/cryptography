// str siempre una cadena con mayúsculas en inglés

function encodeShift(key, str) {
    // key es un int entre 0 y 25 inclusivo
    return 'not implemented'
}

function decodeShift(key, str) {
    return 'not implemented'
}


function encodeSubstitution(key, str) {
    // key es un array de ints sin repeticiones desde 1 a 26
}

function decodeSubstitution(key, str) {}


function encodeAffine(key, str) {
    // key es una pareja de enteros entre 0 y 25, 
    // ya se versificó que el primero es invertible
}

function decodeAffine(key, str) {}


function encodeVigenere(key, str) {
    // key es un array de ints entre 0 y 25
}

function decodeVigenere(key, str) {}


function encodePermutation(key, str) {
    // key es una permutación del tamaño del array
}

function decodePermutation(key, str) {}


function encodeHill(key, img) {}

function decodeHill(key, img) {}

export {encodeShift, encodeSubstitution, encodeAffine, encodeVigenere, encodePermutation, encodeHill}
export {decodeShift, decodeSubstitution, decodeAffine, decodeVigenere, decodePermutation, decodeHill}