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
        return 'Not soluble';
    
    let x=(abs(m-q)*inv[abs(n-p)])%26;
    let y=abs(m-(n*x)%26);
    return [x,y];
}

//análisis de sustitución
function addConjecture(permutation, conjecture){
    let newKey=permutation;
    newKey[code(conjecture[0])]=code(conjecture[1]);
    return newKey;
}


function analyzeVigenere(){}



function analyzeHill(){}

export {occurProb, getFrecuences, code}
