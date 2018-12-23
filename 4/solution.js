// https://adventofcode.com/2018/day/4

const fs = require('fs')

// Part 1
// get logs from file
let input = fs.readFileSync('input.txt', 'utf8')
// make into array of strings
let logStrings = input.split('\n')
// slice off last element which is empty because of extra newline at end of file
logStrings = logStrings.slice(0, logStrings.length - 1)

// process
logData = logStrings.map(string => string.slice(1).split('] '))
logData = logData.map(arr => [...arr[0].split(' '), arr[1]])
// all years are 1518, remove them
logData = logData.map(arr => [arr[0].slice(5), arr[1], arr[2]])
logData = logData.map(arr => [...arr[0].split('-'), arr[1], arr[2]])
// remove text other than guard ID for "Guard #id begins shift"
logData = logData.map(arr => ({
  month: parseInt(arr[0]),
  day: parseInt(arr[1]),
  time: arr[2].split(':'),
  action: arr[3].match(/(\d)+/) ? arr[3].match(/(\d)+/)[0] : arr[3]
}))

// change times to number of minutes past midnight, or negative for before midnight
logData = logData.map(obj => {
  let { month, day, time, action } = obj
  let min
  if (time[0] === '00') min = parseInt(time[1])
  if (time[0] === '23') {
    min = parseInt(time[1]) - 60
    if (month === 12 && day === 31) {
      day = 1
      month = 1
    }
    else if ((month === 2 && day === 28)
    || ((month === 4 || month === 6 || month === 9 || month === 11) && day === 30)
    || (day === 31)) {
      day = 1
      month++
    }
    else day++
  }
  return { month, day, min, action }
})

function sortByDate(a, b) {
  if (a.month > b.month) return 1
  else if (a.month < b.month) return -1
  // month must be equal, so check day
  else if (a.day > b.day) return 1
  else if (a.day < b.day) return -1
  // both month and day must be equal, so check min
  else if (a.min > b.min) return 1
  else if (a.min < b.min) return -1
  else return 0
}

logData.sort(sortByDate)

let sleeper = ''
let sleepTime = 0
let sleepLength = 0
let sleeps = {}

for (let i = 0; i < logData.length; i++) {
  if (logData[i].action.match(/(\d)+/)) {
    sleeper = logData[i].action
  }
  else if (logData[i].action === 'falls asleep') {
    sleepTime = logData[i].min
  }
  else if (logData[i].action === 'wakes up') {
    sleepLength = logData[i].min - sleepTime
    sleeps[sleeper] = (sleeps[sleeper] || 0) + sleepLength
  }
}

let maxMinAsleep = Math.max(...Object.values(sleeps))
let maxSleeper = Object.keys(sleeps).find(key => sleeps[key] === maxMinAsleep)

// which minute does maxSleeper spend asleep the most?

// make array of all sleep/wake records for maxSleeper
let maxSleeperRecords = []
let maxSleeperFound = false

for (let i = 0; i < logData.length; i++) {
  if (logData[i].action === maxSleeper) {
    maxSleeperFound = true
  }
  else if (maxSleeperFound && logData[i].action.match(/(\d)+/)) {
    maxSleeperFound = false
  }
  else if (maxSleeperFound) {
    maxSleeperRecords.push(logData[i])
  }
}

// make array of each minute and how many times guard was asleep during it
let counters = []

for (let m = 0; m < 60; m++) {
  counters[m] = 0
  for (let i = 0; i < maxSleeperRecords.length; i += 2) {
    if (m >= maxSleeperRecords[i].min && m < maxSleeperRecords[i + 1].min) {
      counters[m]++
    }
  }
}

console.log(`Part 1 solution: ${counters.indexOf(Math.max(...counters)) * maxSleeper}`)

// Part 2

// make list of all guards
let guards = []
logData.filter(el => el.action.match(/(\d)+/)).forEach(el => {
  if (!guards.includes(el.action)) {
    guards.push(el.action)
  }
})

// make object with all sleep/wake records for each guard
let guardRecords = {}
let guardFound = false

for (let i = 0; i < guards.length; i++) {
  if (!guardRecords[guards[i]]) { guardRecords[guards[i]] = [] }
  for (let j = 0; j < logData.length; j++) {
    if (logData[j].action === guards[i]) {
      guardFound = true
    }
    else if (guardFound && logData[j].action.match(/(\d)+/)) {
      guardFound = false
    }
    else if (guardFound) {
      guardRecords[guards[i]].push(logData[j])
    }
  }
}

// for each guard, make array of each minute and how many times guard was asleep during it
let guardCounters = {}
let maxTimesAsleep = 0
let maxMinute, maxGuard

for (let i = 0; i < guards.length; i++) {
  guardCounters[guards[i]] = []

  for (let m = 0; m < 60; m++) {
    guardCounters[guards[i]][m] = 0
    for (let j = 0; j < guardRecords[guards[i]].length; j += 2) {
      if (m >= guardRecords[guards[i]][j].min && m < guardRecords[guards[i]][j + 1].min) {
        guardCounters[guards[i]][m]++
      }
    }
  }
  let maxTimesForThisGuard = Math.max(...guardCounters[guards[i]])
  if (maxTimesForThisGuard > maxTimesAsleep) {
    maxTimesAsleep = maxTimesForThisGuard
    maxMinute = guardCounters[guards[i]].indexOf(maxTimesForThisGuard)
    maxGuard = guards[i]
  }
}

console.log(`Part 2 solution: ${maxMinute * maxGuard}`)
