function arrayToMatrix(arr) {
    let root = {4:2, 9:3, 16:4}
    let size = root[arr.length]
    let M = Array(size)
    for(var i = 0; i < size; i++) {
        M[i] = arr.slice(i*size, (i+1)*size)
    }
    return M
}

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

function invertible(M) {
    if(M.length == 1) return M[0][0]
    var det = 0
    for(var i = 0; i < M.length; i++)
        det = (det + M[0][i] * invertible(shrunkMatrix(M, 0, i))) % 2
    return det != 0
}

function inverse(M) {
    let inv = [1, 171, 205, 183, 57, 163, 197, 239,
           241, 27, 61, 167, 41, 19, 53, 223,
           225, 139, 173, 151, 25, 131, 165, 207,
           209, 251, 29, 135, 9, 243, 21, 191,
           193, 107, 141, 119, 249, 99, 133, 175,
           177, 219, 253, 103, 233, 211, 245, 159,
           161, 75, 109, 87, 217, 67, 101, 143,
           145, 187, 221, 71, 201, 179, 213, 127,
           129, 43, 77, 55, 185, 35, 69, 111,
           113, 155, 189, 39, 169, 147, 181, 95,
           97, 11, 45, 23, 153, 3, 37, 79,
           81, 123, 157, 7, 137, 115, 149, 63,
           65, 235, 13, 247, 121, 227, 5, 47,
           49, 91, 125, 231, 105, 83, 117, 31,
           33, 203, 237, 215, 89, 195, 229, 15,
           17, 59, 93, 199, 73, 51, 85, 255]
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
        if(M[i][i] % 2 == 0) {
            for(var j = i + 1; M[j][i] % 2 == 0; j++);
            var aux = M[i]
            M[i] = M[j]
            M[j] = aux
            aux = N[i]
            N[i] = N[j]
            N[j] = aux
            console.log(M)
        }
        //Multiplica toda la fila por el inverso del pivote
        let inverse = inv[parseInt(M[i][i]/2)]
        for(var j = 0; j < M.length; j++) {
            M[i][j] = (M[i][j] * inverse) % 256
            N[i][j] = (N[i][j] * inverse) % 256
        }
        //Llena de ceros debajo y encima del pivote
        for(var j = 0; j < M.length; j++) {
            if(i != j) {
                let m = 256 - M[j][i]
                for(var h = 0; h < M.length; h++) {
                    M[j][h] = ((M[i][h] * m) + M[j][h]) % 256
                    N[j][h] = ((N[i][h] * m) + N[j][h]) % 256
                }
            }
        }
    }
    return N
}

function product(A, B) {
    let C = Array(A.length)
    for(var i = 0; i < A.length; i++) {
        C[i] = Array(B[0].length)
        for(var j = 0; j < B[0].length; j++) {
            C[i][j] = 0
            for(var h = 0; h < B.length; h++) {
                C[i][j] = (C[i][j] + A[i][h]*B[h][j]) % 256
            }
        }
    }
    return C
}

export {arrayToMatrix, invertible, inverse, product}
