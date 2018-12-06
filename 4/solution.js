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
logData = logData.map(arr => [arr[0], arr[1], arr[2], arr[3].match(/(\d)+/) ? arr[3].match(/(\d)+/)[0] : arr[3]])
// change times to number of minutes past midnight, or negative for before midnight
logData = logData.map(arr => {
  let month = parseInt(arr[0])
  let day = parseInt(arr[1])
  let time = arr[2].split(':')
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
  return [month, day, min, arr[3]]
})

function sortByDate(a, b) {
  if (parseInt(a[0]) > parseInt(b[0])) return 1
  else if (parseInt(a[0]) < parseInt(b[0])) return -1
  // month must be equal, so check day
  else if (parseInt(a[1]) > parseInt(b[1])) return 1
  else if (parseInt(a[1]) < parseInt(b[1])) return -1
  // both month and day must be equal, so check hour
  else if (a[2] > b[2]) return 1
  else if (a[2] < b[2]) return -1
  else return 0
}

logData.sort(sortByDate)
// console.log(logData)

// don't know if these are useful
let shiftStarts = logData.filter(el => el[3].match(/(\d)+/))
let sleepTimes = logData.filter(el => el[3] === 'falls asleep')
let wakeTimes = logData.filter(el => el[3] === 'wakes up')

let sleeper = ''
let sleepTime = 0
let sleepLength = 0
let maxSleepLength = 0
let maxSleeper = ''

// this isn't right, it doesn't take into acct multiple sleeps in one shift

for (let i = 0; i < logData.length; i++) {
  if (logData[i][3].match(/(\d)+/)) {
    sleeper = logData[i][3]
  }
  else if (logData[i][3] === 'falls asleep') {
    sleepTime = logData[i][2]
  }
  else if (logData[i][3] === 'wakes up') {
    sleepLength = logData[i][2] - sleepTime
    if (sleepLength > maxSleepLength) {
      maxSleepLength = sleepLength
      maxSleeper = sleeper
    }
  }
}

console.log(maxSleepLength)
console.log(maxSleeper)
