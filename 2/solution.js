// https://adventofcode.com/2018/day/2

const fs = require('fs')

// Part 1
// get box IDs from file
let input = fs.readFileSync('input.txt', 'utf8')
// make into array of strings
let boxIdStrings = input.split('\n')
// slice off last element which is empty because of extra newline at end of file
boxIdStrings = boxIdStrings.slice(0, boxIdStrings.length - 1)

// make an array of objects, one for each box ID
// with properties ID (string), hasTwo, hasThree (booleans)
let boxIdData = []

boxIdStrings.forEach((boxId, i) => {
  boxIdData[i] = {}
  boxIdData[i].Id = boxId

  // count occurrences of each letter
  let letterCounter = {}
  for (let j = 0; j < boxId.length; j++) {
    letterCounter[boxId[j]] = (letterCounter[boxId[j]] || 0) + 1
  }

  // record whether there were any occurrences of two or three of a letter
  boxIdData[i].hasTwo = false
  boxIdData[i].hasThree = false
  Object.keys(letterCounter).forEach(key => {
    if (letterCounter[key] === 2) {
      boxIdData[i].hasTwo = true
    }
    else if (letterCounter[key] === 3) {
      boxIdData[i].hasThree = true
    }
  })
})

// count number of hasTwo and number of hasThree
let twos = boxIdData.reduce((twos, boxId) => twos + (boxId.hasTwo ? 1 : 0), 0)
let threes = boxIdData.reduce((threes, boxId) => threes + (boxId.hasThree ? 1 : 0), 0)

let result = twos * threes
console.log(`Part 1 solution: ${result}`)

// Part 2
let diffCount = 0
let diffPosition = -1
let part2Result = ''

// iterate through boxIdStrings, for each element compare it to all elements after it
for (let i = 0; i < boxIdStrings.length; i++) {
  for (let j = i + 1; j < boxIdStrings.length; j++) {
    let boxId1 = boxIdStrings[i]
    let boxId2 = boxIdStrings[j]

    // compare strings (they are all the same length)
    for (let char = 0; char < boxId1.length; char++) {
      // if you find a character different and it's the first one, record it
      if (boxId1[char] !== boxId2[char]) {
        if (diffCount === 0) {
          diffPosition = char
          diffCount = 1
        }
        // if you find a char different and it's the second one, break, not a match
        else {
          diffCount = 0
          break
        }
      }
    }
    // after exiting comparison loop, if there was exactly one difference, that's the match
    if (diffCount === 1) {
      part2Result = boxId1.slice(0, diffPosition) + boxId1.slice(diffPosition + 1)
    }
  }
}

console.log(`Part 2 solution: ${part2Result}`)
