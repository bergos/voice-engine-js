const fs = require('fs')
const EventEmitter = require('events').EventEmitter
const Recorder = require('..').Recorder
const Slice = require('..').Slice

const recorder = new Recorder({
  channels: 1
})

const trigger = new EventEmitter()

const slice = new Slice(trigger)

const file = fs.createWriteStream('test.wav')

recorder.pipe(slice).pipe(file)

recorder.once('start', () => {
  console.log('Recording started...')

  setTimeout(() => {
    console.log('start')

    trigger.emit('start')
  }, 1000)

  setTimeout(() => {
    console.log('end')

    trigger.emit('end')
  }, 3000)

  setTimeout(() => {
    recorder.stop()
  }, 4000)
})

console.log('Takes a slice of audio after 1 second with the length of 2 seconds after the program was started.')
console.log('The result is stored in "test.wav".')
console.log('The program will exit after 4 seconds')
