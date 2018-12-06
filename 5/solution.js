// https://adventofcode.com/2018/day/5

const fs = require('fs')

// Part 1
// get string from file
let input = fs.readFileSync('input.txt', 'utf8')
// slice off newline at end
input = input.slice(0, input.length - 1)

// recursive function, probably terrible because I had to increase Node stack size to run it
function react(polymer) {
  // iterate through string, only till length - 1 because we're checking 2 characters at a time
  for (let i = 0; i < polymer.length - 1; i++) {
    // if it's a capital letter and next letter is the lowercase equivalent, remove them and react again
    if (polymer[i].charCodeAt(0) >= 65 && polymer[i].charCodeAt(0) <= 90
    && polymer[i + 1] === String.fromCharCode(polymer[i].charCodeAt(0) + 32)) {
      return react(polymer.slice(0, i) + polymer.slice(i + 2))
    }
    // if it's a lowercase letter and next letter is the capital equivalent, remove them and react again
    else if (polymer[i].charCodeAt(0) >= 97 && polymer[i].charCodeAt(0) <= 122
    && polymer[i + 1] === String.fromCharCode(polymer[i].charCodeAt(0) - 32)) {
      return react(polymer.slice(0, i) + polymer.slice(i + 2))
    }
  }
  // if you get to the end of the string, it's all reacted
  return polymer
}

// console.log(`Part 1 solution: ${react(input).length}`)

// Part 2
let lengthPerLetter = {}

for (let i = 65; i <= 90; i++) {
  let data = input
  // remove all instances of letter (capital and lowercase)
  let cap = String.fromCharCode(i)
  let low = String.fromCharCode(i + 32)
  while (data.indexOf(cap) !== -1) {
    data = data.slice(0, data.indexOf(cap)) + data.slice(data.indexOf(cap) + 1)
  }
  while (data.indexOf(low) !== -1) {
    data = data.slice(0, data.indexOf(low)) + data.slice(data.indexOf(low) + 1)
  }
  lengthPerLetter[i] = react(data).length
}

console.log(lengthPerLetter)
