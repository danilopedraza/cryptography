function textToVector(str) {
    let V = Array(str.length)
    for(var i = 0; i < str.length; i++) {
        V[i] = str.charCodeAt(i) - 65
    }
    return V
}

//M true para mayúsculas
function vectorToText(V, M) {
    let W = Array(V.length)
    let a = 97
    if(M) a = 65
    for(var i = 0; i < V.length; i++) {
        W[i] = String.fromCharCode(V[i] + a)
    }
    return W.join("")
}

function encodeShift(key, str) {
    let X = textToVector(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = (X[i] + key) % 26
    }
    return vectorToText(Y, true)
}

function decodeShift(key, str) {
    let Y = textToVector(str)
    let X = Array(Y.length)
    for(var i = 0; i < Y.length; i++) {
        X[i]= (Y[i] - key + 26) % 26
    }
    return vectorToText(X, false)
}

function encodeSubstitution(key, str) {
    let X = textToVector(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = key[X[i]] - 1
    }
    return vectorToText(Y, true)
}

function decodeSubstitution(key, str) {
    let Y = textToVector(str)
    let X = Array(Y.length)
    let invkey = Array(26)
    for(var i = 0; i < 26; i++) {
        invkey[key[i] - 1] = i + 1
    }
    for(var i = 0; i < Y.length; i++) {
        X[i] = invkey[Y[i]] - 1
    }
    return vectorToText(X, false)
}

function encodeAffine(key, str) {
    let a = key[0]
    let b = key[1]
    let X = textToVector(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = (a*X[i] + b) % 26
    }
    return vectorToText(Y, true)
}

function decodeAffine(key, str) {
    let inv = {1:1, 3:9, 5:21, 7:15, 9:3, 11:19, 15:7, 17:23, 19:11, 21:5, 23:17, 25:25}
    let a = key[0]
    let b = key[1]
    let Y = textToVector(str)
    let X = Array(Y.length)
    for(var i = 0; i < Y.length; i++) {
        X[i] = (inv[a]*(Y[i] - b + 26)) % 26
    }
    return vectorToText(X, false)
}

function encodeVigenere(key, str) {
    let X = textToVector(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = (X[i] + key[i % key.length]) % 26
    }
    return vectorToText(Y, true)
}

function decodeVigenere(key, str) {
    let Y = textToVector(str)
    let X = Array(Y.length)
    for(var i = 0; i < Y.length; i++) {
        X[i] = (Y[i] - key[i % key.length] + 26) % 26
    }
    return vectorToText(X, false)
}

function encodePermutation(key, str) {
    let X = textToVector(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = X[i - (i % key.length) + key[i % key.length] - 1]
    }
    return vectorToText(Y, true)
}

function decodePermutation(key, str) {
    let Y = textToVector(str)
    let X = Array(Y.length)
    let invkey = Array(key.length)
    for(var i = 0; i < 26; i++) {
        invkey[key[i] - 1] = i + 1
    }
    for(var i = 0; i < Y.length; i++) {
        X[i] = Y[i - (i % key.length) + invkey[i % key.length] - 1]
    }
    return vectorToText(X, false)
}


function encodeHill(key, arr) {
    // arr es un arreglo (duh) de 0 a 255 inclusivo
    return "Hill"
}

function decodeHill(key, arr) {
    return 'this is just a test'
}

export {encodeShift, encodeSubstitution, encodeAffine, encodeVigenere, encodePermutation, encodeHill}
export {decodeShift, decodeSubstitution, decodeAffine, decodeVigenere, decodePermutation, decodeHill}