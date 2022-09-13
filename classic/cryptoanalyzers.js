import * as cs from './cryptosystems.js'

// Funciones y Constantes auxiliares
const occurProb=[ 
    [ 'E', 0.127 ],[ 'T', 0.091 ],[ 'A', 0.082 ],[ 'O', 0.075 ],[ 'I', 0.07 ],
    [ 'N', 0.067 ],[ 'S', 0.063 ],[ 'H', 0.061 ],[ 'R', 0.06 ],[ 'D', 0.043 ],
    [ 'L', 0.04 ],[ 'C', 0.028 ],[ 'U', 0.028 ],[ 'M', 0.024 ],[ 'W', 0.023 ],
    [ 'F', 0.022 ],[ 'G', 0.02 ],[ 'Y', 0.02 ],[ 'P', 0.019 ],[ 'B', 0.015 ],
    [ 'V', 0.01 ],[ 'K', 0.008 ],[ 'J', 0.002 ],[ 'X', 0.001 ],[ 'Z', 0.001 ],
    [ 'Q', 0.001 ]
]

const digramFreq = [
    'TH', 'HE', 'IN', 'EN', 'NT',
    'RE', 'ER', 'AN', 'TI', 'ES'
]

const trigramFreq = [
    'THE', 'AND', 'THA', 'ENT', 'ING'
]

function abs(n){
    return (26+n)%26;
}

function code(char){
    return char.charCodeAt(0)-65
}

//Criptoanálisis de Cesar
function analyzeShift(str){
    let allPlaintexts= Array(25);
    for (let i = 0; i < 25; i++) 
        allPlaintexts[i]=cs.encodeShift(i+1,str);
    return allPlaintexts;
}

//Ataques por frecuencias
function getFrecuences(str){
    /*Retorna un array con las frecuencias de los caracteres
    en orden descendente*/

    let frecuences=Array(26).fill().map((x,i)=>[String.fromCharCode(i+65),0]);
    let Y=cs.textToArray(str);

    for (let i = 0; i < str.length; i++) 
        frecuences[Y[i]][1]++;
    
    frecuences.sort(function(a,b){return b[1]-a[1]});

    return frecuences;
}

function getDigramFrequences(str) {
    let frequences = {}
    for (let i = 0; i < str.length-1; i++) {
        let substr = str.substring(i,i+2)
        if (substr in frequences)
            frequences[substr]++
        else
            frequences[substr] = 1
    }

    frequences = Object.keys(frequences).map(function(key) {
        return [key, frequences[key]];
    })
    frequences.sort(function(first, second) {
        return second[1] - first[1];
      });

    return frequences
}

function getTrigramFrequences(str) {
    let frequences = {}
    for (let i = 0; i < str.length-2; i++) {
        let substr = str.substring(i,i+3)
        if (substr in frequences)
            frequences[substr]++
        else
            frequences[substr] = 1
    }

    frequences = Object.keys(frequences).map(function(key) {
        return [key, frequences[key]];
    })
    frequences.sort(function(first, second) {
        return second[1] - first[1];
      });

    return frequences
}

function sugestedConj(frecuences){
    /*Retorna una lista de conjeturas recomendadas i.e.
    arreglos de la forma [<caracterClaro>,<caracterEncriptado>]*/

    let suggestions=Array(9);
    for (let i = 0; i < 9; i++) {
        a=Math.floor(i/3);
        b=i%3;
        suggestions[i]=[occurProb[a][0],frecuences[b][0]];
    }
    return suggestions;
}


//Criptoanálisis de afín
function getKey(conjecture1, conjecture2){
    /*Resuelve el sistema
        n*x + y = m
        p*x + y = q
    Donde n,m,p y q \in Z_26 */

    let inv = {
        1:1, 3:9, 5:21, 7:15, 9:3, 11:19, 15:7,
        17:23, 19:11, 21:5, 23:17, 25:25
    };
    let n=code(conjecture1[0]), m=code(conjecture1[1]);
    let p=code(conjecture2[0]), q=code(conjecture2[1]);

    if((n-p)%2==0 || (n-p)%13==0)
        return null
    
    let x=(abs(m-q)*inv[abs(n-p)])%26;
    let y=abs(m-(n*x)%26);
    
    if (!(x in inv)) return null
    return [x,y];
}

//análisis de sustitución
function addConjecture(permutation, conjecture){
    let newKey=permutation;
    newKey[code(conjecture[0])]=code(conjecture[1]);
    return newKey;
}


function analyzeVigenere(){}

// copiado de matrix.js (vale la pena solicitar todo el archivo?)
function shrunkMatrix(M, a, b) {
    let N = Array(M.length-1)
    for(var i = 0; i < M.length-1; i++) {
        N[i] = Array(M.length-1)
        for(var j = 0; j < M.length-1; j++) {
            if(i < a && j < b) N[i][j] = M[i][j]
            if(i >= a && j < b) N[i][j] = M[i+1][j]
            if(i < a && j >= b) N[i][j] = M[i][j+1]
            if(i >= a && j >= b) N[i][j] = M[i+1][j+1]
        }
    }
    return N
}

function invertibleMod26(M) {
    let inv = {
        1:1, 3:9, 5:21, 7:15, 9:3, 11:19, 15:7,
        17:23, 19:11, 21:5, 23:17, 25:25
    }

    if(M.length == 1) return M[0][0]
    var det = 0
    var sign = 1
    for(var i = 0; i < M.length; i++)
        det += (M[0][i] * (sign * invertibleMod26(shrunkMatrix(M, 0, i))))
        sign *= -1
    return det in inv
}

function inverseMod26(M) {
    let inv = {
        1:1, 3:9, 5:21, 7:15, 9:3, 11:19, 15:7,
        17:23, 19:11, 21:5, 23:17, 25:25
    }
    let N = Array(M.length)
    //Crea matriz identidad
    for(var i = 0; i < M.length; i++) {
        N[i] = Array(M.length)
        for(var j = 0; j < M.length; j++) {
            if(i == j) N[i][j] = 1
            else N[i][j] = 0
        }
    }
    for(var i = 0; i < M.length; i++) {
        //Verifica que el pivote sea invertible
        if(!(M[i][i] in inv)) {
            for(var j = i + 1; M[j][i] % 2 == 0; j++);
            var aux = M[i]
            M[i] = M[j]
            M[j] = aux
            aux = N[i]
            N[i] = N[j]
            N[j] = aux
        }
        //Multiplica toda la fila por el inverso del pivote
        let inverse = inv[parseInt(M[i][i])]
        for(var j = 0; j < M.length; j++) {
            M[i][j] = (M[i][j] * inverse) % 26
            N[i][j] = (N[i][j] * inverse) % 26
        }
        //Llena de ceros debajo y encima del pivote
        for(var j = 0; j < M.length; j++) {
            if(i != j) {
                let m = 26 - M[j][i]
                for(var h = 0; h < M.length; h++) {
                    M[j][h] = ((M[i][h] * m) + M[j][h]) % 26
                    N[j][h] = ((N[i][h] * m) + N[j][h]) % 26
                }
            }
        }
    }
    return N
}


function arrayToMatrix(arr) {
    let root = {4:2, 9:3, 16:4}
    let size = root[arr.length]
    let M = Array(size)
    for(var i = 0; i < size; i++) {
        M[i] = arr.slice(i*size, (i+1)*size)
    }
    return M
}

function productMod26(A, B) {
    let C = Array(A.length)
    for(var i = 0; i < A.length; i++) {
        C[i] = Array(B[0].length)
        for(var j = 0; j < B[0].length; j++) {
            C[i][j] = 0
            for(var h = 0; h < B.length; h++) {
                C[i][j] = (C[i][j] + A[i][h]*B[h][j]) % 26
            }
        }
    }
    return C
}

function analyzeHill(plainText, cipherText, lengths) {
    // se asume que los dos strings son de la misma longitud
    var res = []

    for (let i = 0; i < lengths.length; i++) {
        var length = lengths[i]*lengths[i]
        console.log(length)

        for (let j = 0; length*(j+1) < plainText.length; j++) {
            var x = arrayToMatrix(Array.from( plainText.slice(length*j, length*(j+1)), (str,_) => code(str)))
            var y = arrayToMatrix(Array.from(cipherText.slice(length*j, length*(j+1)), (str,_) => code(str)))
            console.log(x,y)

            if (invertibleMod26(x)) {
                console.log('invertible')
                res.push(productMod26(inverseMod26(x),y))
                break
            }
            else continue
        }
    }

    return res
}

export {occurProb, getFrecuences,
        digramFreq, getDigramFrequences,
        trigramFreq, getTrigramFrequences,
        getKey,
        code,
        analyzeHill
}
