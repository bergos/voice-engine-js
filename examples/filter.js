const fs = require('fs')
const Filter = require('..').Filter
const Recorder = require('..').Recorder

const recorder = new Recorder({
  channels: 1
})

let active = false

const filter = new Filter(() => active)

const file = fs.createWriteStream('test.wav')

recorder.pipe(filter).pipe(file)

function toggle () {
  active = !active

  console.log(active ? 'on' : 'off')

  setTimeout(toggle, 1000)
}

recorder.once('start', () => {
  console.log('Recording started...')

  toggle()
})

console.log('Processes the recorded audio with a pass through filter which switches on and off every second.')
console.log('The result is stored in "test.wav".')
console.log('Exit the program with Ctrl-C.')
