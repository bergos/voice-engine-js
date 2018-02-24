const Detector = require('snowboy').Detector
const Models = require('snowboy').Models
const Transform = require('stream').Transform

class SnowboyKeywordSpotting extends Transform {
  constructor (options) {
    options = options || {}

    super({
      objectMode: true
    })

    this.keyword = 'snowboy'
    this.timeout = options.timeout || 1000

    this.models = new Models()

    this.models.add({
      file: 'node_modules/snowboy/resources/snowboy.umdl',
      sensitivity: '0.5',
      hotwords : 'snowboy'
    })

    this.init()
  }

  init () {
    this.lastSound = null

    this.detector = new Detector({
      resource: 'node_modules/snowboy/resources/common.res',
      models: this.models,
      audioGain: 2.0
    })

    this.detector.on('silence', () => {
      if (!this.lastSound) {
        return
      }

      if ((new Date()).valueOf() - this.lastSound > this.timeout) {
        this.emit('speech-end')

        this.lastSound = null
      }
    })

    this.detector.on('sound', () => {
      if (this.lastSound) {
        this.lastSound = (new Date()).valueOf()
      }
    })

    this.detector.on('error', (err) => {
      this.emit('error', err)
    })

    this.detector.on('hotword', (index, hotword, chunk) => {
      this.lastSound = (new Date()).valueOf()

      this.emit('keyword', hotword, chunk)

      this.emit('speech-start')
    })
  }

  _write (chunk, encoding, callback) {
    this.detector.write(chunk, encoding, callback)
  }
}

module.exports = SnowboyKeywordSpotting
