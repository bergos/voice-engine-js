const EventEmitter = require('events').EventEmitter
const Recorder = require('..').Recorder
const Slice = require('..').Slice
const SpeechToText = require('..').AutoSpeechToText

const recorder = new Recorder({
  channels: 1
})

const trigger = new EventEmitter()

const slice = new Slice(trigger)

const speechToText = new SpeechToText()

speechToText.on('data', json => {
  console.log('text: ' + JSON.stringify(json, null, ' '))
})

recorder.pipe(slice).pipe(speechToText)

recorder.once('start', () => {
  console.log('Recording started...')

  trigger.emit('start')

  setTimeout(() => {
    console.log('Recording stopped. Waiting for speech to text processing...')

    trigger.emit('end')

    recorder.stop()
  }, 5000)
})

console.log('Records 5 seconds of audio and converts it to text.')
console.log('The program will exit when the conversion is done.')
