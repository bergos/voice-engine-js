const fs = require('fs')
const Recorder = require('..').Recorder

const recorder = new Recorder({
  channels: 4
})

const file = fs.createWriteStream('test.wav')

recorder.pipe(file)

recorder.once('start', () => {
  console.log('Recording started...')

  setTimeout(() => {
    recorder.stop()
  }, 3000)
})

console.log('Records 4 channel audio and saves it into the file "test.wav".')
console.log('The program will exit after 3 seconds.')
