import * as matrix from './Matrix.js'

function textToArray(str) {
    let V = Array(str.length)
    for(var i = 0; i < str.length; i++) {
        V[i] = str.charCodeAt(i) - 65
    }
    return V
}

//M true para mayúsculas
function arrayToText(V, M) {
    let W = Array(V.length)
    let a = 97
    if(M) a = 65
    for(var i = 0; i < V.length; i++) {
        W[i] = String.fromCharCode(V[i] + a)
    }
    return W.join("")
}

function encodeShift(key, str) {
    let X = textToArray(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = (X[i] + key) % 26
    }
    return arrayToText(Y, true)
}

function decodeShift(key, str) {
    let Y = textToArray(str)
    let X = Array(Y.length)
    for(var i = 0; i < Y.length; i++) {
        X[i]= (Y[i] - key + 26) % 26
    }
    return arrayToText(X, false)
}

function encodeSubstitution(key, str) {
    let X = textToArray(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = key[X[i]] - 1
    }
    return arrayToText(Y, true)
}

function decodeSubstitution(key, str) {
    let Y = textToArray(str)
    let X = Array(Y.length)
    let invkey = Array(26)
    for(var i = 0; i < 26; i++) {
        invkey[key[i] - 1] = i + 1
    }
    for(var i = 0; i < Y.length; i++) {
        X[i] = invkey[Y[i]] - 1
    }
    return arrayToText(X, false)
}

function encodeAffine(key, str) {
    let a = key[0]
    let b = key[1]
    let X = textToArray(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = (a*X[i] + b) % 26
    }
    return arrayToText(Y, true)
}

function decodeAffine(key, str) {
    let inv = {1:1, 3:9, 5:21, 7:15, 9:3, 11:19, 15:7, 17:23, 19:11, 21:5, 23:17, 25:25}
    let a = key[0]
    let b = key[1]
    let Y = textToArray(str)
    let X = Array(Y.length)
    for(var i = 0; i < Y.length; i++) {
        X[i] = (inv[a]*(Y[i] - b + 26)) % 26
    }
    return arrayToText(X, false)
}

function encodeVigenere(key, str) {
    let X = textToArray(str)
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = (X[i] + key[i % key.length]) % 26
    }
    return arrayToText(Y, true)
}

function decodeVigenere(key, str) {
    let Y = textToArray(str)
    let X = Array(Y.length)
    for(var i = 0; i < Y.length; i++) {
        X[i] = (Y[i] - key[i % key.length] + 26) % 26
    }
    return arrayToText(X, false)
}

function stringGen(len) {
    var text = ""
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

function encodePermutation(key, str) {
    let X
    if(str.length % key.length == 0)
        X = textToArray(str)
    else
        X = textToArray(str+ stringGen(key.length - (str.length % key.length)))
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = X[i - (i % key.length) + key[i % key.length] - 1]
    }
    return arrayToText(Y, true)
}

function decodePermutation(key, str) {
    let Y
    if(str.length % key.length == 0)
        Y = textToArray(str)
    else
        Y = textToArray(str+ stringGen(key.length - (str.length % key.length)))
    let X = Array(Y.length)
    let invkey = Array(key.length)
    for(var i = 0; i < 26; i++) {
        invkey[key[i] - 1] = i + 1
    }
    for(var i = 0; i < Y.length; i++) {
        X[i] = Y[i - (i % key.length) + invkey[i % key.length] - 1]
    }
    return arrayToText(X, false)
}

function encodeHill(key, arr) {
    let kM = matrix.arrayToMatrix(key)
    let X = Array(parseInt(arr.length/kM.length))
    let Y = Array(X.length)
    for(var i = 0; i < X.length; i++) {
        X[i] = arr.slice(i*kM.length, (i+1)*kM.length)
    }
    Y = matrix.product(X, kM)
    if(arr.length % kM.length != 0)
        Y.push(arr.slice(0,-(arr.length % kM.length)))
    return Y.flat()
}

function decodeHill(key, arr) {
    let invkM = matrix.inverse(matrix.arrayToMatrix(key))
    let Y = Array(parseInt(arr.length/invkM.length))
    let X = Array(Y.length)
    for(var i = 0; i < X.length; i++) {
        Y[i] = arr.slice(i*invkM.length, (i+1)*invkM.length)
    }
    X = matrix.product(Y, invkM)
    if(arr.length % invkM.length != 0)
        X.push(arr.slice(0,-(arr.length % invkM.length)))
    return X.flat()
}

export {encodeShift, encodeSubstitution, encodeAffine, encodeVigenere, encodePermutation, encodeHill}
export {decodeShift, decodeSubstitution, decodeAffine, decodeVigenere, decodePermutation, decodeHill}
