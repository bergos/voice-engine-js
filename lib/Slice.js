const Reader = require('wav').Reader
const Writer = require('wav').Writer
const Transform = require('stream').Transform

class Slice extends Transform {
  constructor (trigger, options) {
    options = options || {}

    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.reader = new Reader()

    this.reader.on('format', format => {
      this.format = format

      this.reader.on('data', chunk => {
        if (this.writer) {
          this.writer.write(chunk)
        }
      })
    })

    trigger.on(options.start || 'start', () => {
      this.chunks = []
      this.writer = new Writer(this.format)

      this.writer.on('data', (chunk) => {
        this.chunks.push(chunk)
      })
    })

    trigger.on(options.end || 'end', () => {
      this.push(Buffer.concat(this.chunks))

      this.writer = null
    })
  }

  _transform (chunk, encoding, callback) {
    this.reader.write(chunk, encoding, callback)
  }
}

module.exports = Slice
