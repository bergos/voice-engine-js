const Reader = require('wav').Reader
const Writer = require('wav').Writer
const Transform = require('stream').Transform

class Filter extends Transform {
  constructor (callback) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.reader = new Reader()

    this.reader.on('format', format => {
      this.writer = new Writer(format)

      this.writer.on('data', (chunk) => {
        this.push(chunk)
      })
    })

    this.reader.on('data', chunk => {
      if (callback(chunk)) {
        this.writer.write(chunk)
      }
    })
  }

  _transform (chunk, encoding, callback) {
    this.reader.write(chunk, encoding, callback)
  }
}

module.exports = Filter
