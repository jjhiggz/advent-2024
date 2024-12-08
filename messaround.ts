import { Permutation } from "js-combinatorics";
import {unique} from "remeda"






/**                      
                         + 
               *      15
                         * 
     *  5 =>   5
               +      8
                         +
 1  
               *     15
     +  5 =>  5
               +      8
 */  

// +*    +*       +*      +*

// length 5  [1, 5, 3, 2, 5]
// 1 + 1 + 2 +6 + => 32n
// for(let multipliers = 0; multipliers < 5; multipliers++){
//     const pattern = new Permutation([..."+".repeat(multipliers)]).length
//     console.log(pattern)

// } 

const getIterationsTree  = (n: number) =>  {
    let sum = 0
    for(let i = 1; i <= n; i++){
        sum += 2 ** (i - 1)
    }
    return sum
}

const getIterationsPermutations = (n: number) => {
    return new Permutation("a".repeat(n)).length
}

const length = 20
// console.log(getIterationsTree(length))
console.log(
    
    unique(
        new Permutation("aaaa").toArray().map(n => n.join(""))
    ).length
)

// console.log(new Permutation("a".repeat(length)).toArray())


// 1
// 2
// 6
// 24
// 124 
// 720
// 5040
