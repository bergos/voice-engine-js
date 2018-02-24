const fs = require('fs')
const ChannelPicker = require('..').ChannelPicker
const Recorder = require('..').Recorder

const recorder = new Recorder({
  channels: 4
})

const channel1 = new ChannelPicker(1)
const channel2 = new ChannelPicker(2)

const channel1File = fs.createWriteStream('channel1.wav')
const channel2File = fs.createWriteStream('channel2.wav')

recorder.pipe(channel1).pipe(channel1File)
recorder.pipe(channel2).pipe(channel2File)

recorder.once('start', () => {
  console.log('Recording started...')

  setTimeout(() => {
    recorder.stop()
  }, 3000)
})

console.log('Records audio with 4 channels and saves channel 1 and 2 into the files "channel[1|2].wav".')
console.log('The program will exit after 3 seconds.')
