// https://adventofcode.com/2018/day/1

const fs = require('fs')

// Part 1
// get frequencies from file
let input = fs.readFileSync('input.txt', 'utf8')
// make into array of strings
let changeStrings = input.split('\n')
// slice off last element which is empty because of extra newline at end of file
changeStrings = changeStrings.slice(0, changeStrings.length - 1)
// make into array of numbers, pos or neg (assumes valid numbers and no 0)
let changeArray = changeStrings.map(el => el[0] === '-' ? -1 * parseInt(el.slice(1)) : parseInt(el.slice(1)))
// sum all numbers
let result = changeArray.reduce((total, change) => total + change, 0)
console.log(`Part 1 solution: ${result}`)

// Part 2
let currentFreq = 0
let pastFreqObj = {}
let solution

// keep going through list of changes over and over until you get to a frequency you've seen before
while (solution === undefined) {
  for (let i = 0; i < changeArray.length; i++) {
    // if freq is one you've seen before, that's the result
    if (pastFreqObj[currentFreq]) {
      solution = currentFreq
      break
    }
    // otherwise record each past frequency in an object, then change frequency
    else {
      pastFreqObj[currentFreq] = 1
      currentFreq += changeArray[i]
    }
  }
}

console.log(`Part 2 solution: ${solution}`)
