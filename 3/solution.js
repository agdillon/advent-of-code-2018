// https://adventofcode.com/2018/day/3

const fs = require('fs')

// Part 1
// get claims from file
let input = fs.readFileSync('input.txt', 'utf8')
// make into array of strings
let claimStrings = input.split('\n')
// slice off last element which is empty because of extra newline at end of file
claimStrings = claimStrings.slice(0, claimStrings.length - 1)
// process array of claim strings into array of objects containing the claim info
let claimArrs = claimStrings.map(claimString => claimString.slice(1).split(/ ?[@:] ?/))
let claimObjs = []
for (let i = 0; i < claimArrs.length; i++) {
  claimObjs[i] = {}
  claimObjs[i].id = claimArrs[i][0]
  claimObjs[i].location = claimArrs[i][1].split(',').map(el => parseInt(el))
  claimObjs[i].dimensions = claimArrs[i][2].split('x').map(el => parseInt(el))
}

let overlap = 0
let fabric = []

for (let i = 0; i < claimObjs.length; i++) {
  for (let j = claimObjs[i].location[0] + 1; j <= claimObjs[i].location[0] + claimObjs[i].dimensions[0]; j++) {
    fabric[j] = fabric[j] || []
    for (let k = claimObjs[i].location[1] + 1; k <= claimObjs[i].location[1] + claimObjs[i].dimensions[1]; k++) {
      fabric[j][k] = (fabric[j][k] || 0) + 1
    }
  }
}

for (let a = 0; a < fabric.length; a++) {
  fabric[a] = fabric[a] || []
  for (let b = 0; b < fabric[a].length; b++) {
    if (fabric[a][b] > 1) {
      overlap++
    }
  }
}

console.log(`Part 1 solution: ${overlap}`)

// Part 2

let isAnswer = true
let solution = ''

for (let i = 0; i < claimObjs.length; i++) {
  for (let j = claimObjs[i].location[0] + 1; j <= claimObjs[i].location[0] + claimObjs[i].dimensions[0]; j++) {
    for (let k = claimObjs[i].location[1] + 1; k <= claimObjs[i].location[1] + claimObjs[i].dimensions[1]; k++) {
      if (fabric[j][k] !== 1) {
        isAnswer = false
        break
      }
    }
  }
  if (isAnswer === true) {
    solution = claimObjs[i].id
  }
  isAnswer = true
}

console.log(`Part 2 solution: ${solution}`)
