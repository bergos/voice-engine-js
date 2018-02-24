const clone = require('lodash/clone')
const merge = require('lodash/merge')
const Reader = require('wav').Reader
const Writer = require('wav').Writer
const Transform = require('stream').Transform

class ChannelPicker extends Transform {
  constructor (channel) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.channel = channel
    this.queue = Buffer.alloc(0)

    this.reader = new Reader()

    this.reader.on('format', format => {
      this.inputFormat = format
      this.outputFormat = merge(clone(format), {channels: 1})

      this.writer = new Writer(this.outputFormat)

      this.writer.on('data', (chunk) => {
        this.push(chunk)
      })

      this.reader.on('data', chunk => {
        this.queue = Buffer.concat([this.queue, chunk])

        this.processQueue()
      })
    })
  }

  _transform (chunk, encoding, callback) {
    this.reader.write(chunk, encoding, callback)
  }

  processQueue () {
    const chunkSize = this.inputFormat.channels * this.inputFormat.bitDepth / 8
    const chunkNumber = Math.floor(this.queue.length / chunkSize)
    const batch = []

    for (let offset = this.channel * this.inputFormat.bitDepth / 8; offset < chunkNumber * chunkSize; offset += chunkSize) {
      batch.push(this.queue.slice(offset, offset + this.outputFormat.bitDepth / 8))
    }

    this.queue = this.queue.slice(chunkNumber * chunkSize)

    this.writer.write(Buffer.concat(batch))
  }
}

module.exports = ChannelPicker
