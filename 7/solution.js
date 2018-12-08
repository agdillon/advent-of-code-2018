// https://adventofcode.com/2018/day/7

const fs = require('fs')

// Part 1
// get instructions from file
let input = fs.readFileSync('input.txt', 'utf8')
// make into array of strings
let instructions = input.split('\n')
// slice off last element which is empty because of extra newline at end of file
instructions = instructions.slice(0, instructions.length - 1)

// all steps and whether they're complete or not
let allSteps = {}
// key is step, value is array of prereqs
let stepPrereqs = {}
for (let i = 0; i < instructions.length; i++) {
  item = instructions[i].replace(/Step (.) must be finished before step (.) can begin\./, '$1 $2').split(' ')
  allSteps[item[0]] = false
  allSteps[item[1]] = false
  if (!stepPrereqs[item[1]]) { stepPrereqs[item[1]] = [] }
  stepPrereqs[item[1]].push(item[0])
}

// then make a list of steps that are complete
// and a list of steps that are ready
let stepsComplete = []
let stepsReady = []

function lookForReadySteps() {
  Object.keys(allSteps).forEach(step => {
    if (!stepsComplete.includes(step) && !stepsReady.includes(step)) {
      if (!stepPrereqs[step]) {
        stepsReady.push(step)
      }
      else {
        let prereqsComplete = true
        stepPrereqs[step].forEach(prereq => {
          if (!stepsComplete.includes(prereq)) { prereqsComplete = false }
        })
        if (prereqsComplete) {
          stepsReady.push(step)
        }
      }
    }
  })
}

// then go through steps object again and add any more ready ones
// then repeat
while (Object.values(allSteps).includes(false)) {
  lookForReadySteps()

  // choose the next one by alpha order
  let completedStep = stepsReady.sort().shift()
  stepsComplete.push(completedStep)
  allSteps[completedStep] = true
}

let finalSteps = stepsComplete.join('')

console.log(`Part 1 solution: ${finalSteps}`)
