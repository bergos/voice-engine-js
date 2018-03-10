const Reader = require('wav').Reader
const Transform = require('stream').Transform

class ToArray extends Transform {
  constructor (options) {
    options = options || {}

    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.samplesPerChunk = options.samplesPerChunk

    this.queue = Buffer.alloc(0)

    this.reader = new Reader()

    this.reader.on('format', format => {
      this.format = format

      this.emit('format', this.format)

      this.reader.on('data', chunk => {
        this.queue = Buffer.concat([this.queue, chunk])

        while (this.available()) {
          this.processQueue()
        }
      })
    })
  }

  _transform (chunk, encoding, callback) {
    this.reader.write(chunk, encoding, callback)
  }

  _flush (callback) {
    while (this.available()) {
      this.processQueue()
    }

    this.processQueue(true)

    callback()
  }

  processQueue (flush) {
    const channels = this.format.channels
    const bytesPerSample = this.format.bitDepth / 8
    const samplesAvailable = flush ? this.samplesAvailable() : this.samplesPerChunk || this.samplesAvailable()

    if (samplesAvailable === 0) {
      return
    }

    const chunks = []

    for (let channel = 0; channel < channels; channel++) {
      chunks[channel] = new Int16Array(samplesAvailable)
    }

    for (let index = 0; index < samplesAvailable; index++) {
      chunks[index % channels][Math.floor(index / channels)] = this.queue.readInt16LE(index * bytesPerSample)
    }

    this.queue = this.queue.slice(samplesAvailable * bytesPerSample * channels)

    this.push(chunks)
  }

  samplesAvailable () {
    return Math.floor(this.queue.length / this.format.bitDepth * 8 / this.format.channels)
  }

  available () {
    const samplesAvailable = this.samplesAvailable()

    if (this.samplesPerChunk && this.samplesPerChunk > samplesAvailable) {
      return false
    }

    return samplesAvailable > 0
  }
}

module.exports = ToArray
