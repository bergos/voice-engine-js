const KeywordSpotting = require('..').AutoKeywordSpotting
const Recorder = require('..').Recorder

const recorder = new Recorder({
  channels: 1
})

const keywordSpotting = new KeywordSpotting()

keywordSpotting.on('keyword', (keyword) => {
  console.log('keyword: ' + keyword)
})

keywordSpotting.on('speech-start', () => {
  console.log('start')
})

keywordSpotting.on('speech-end', () => {
  console.log('end')
})

recorder.pipe(keywordSpotting)

recorder.once('start', () => {
  console.log('Recording started...')
})

console.log('Listens for the keyword "' + keywordSpotting.keyword + '" and shows the start and end of speech event after the keyword.')
console.log('Exit program with Ctrl-C.')
