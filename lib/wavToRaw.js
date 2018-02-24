const PassThrough = require('stream').PassThrough
const Reader = require('wav').Reader

function wavToRaw (wav) {
  return new Promise(resolve => {
    const input = new PassThrough()
    const reader = new Reader()

    const raw = []
    const result = {}

    reader.on('format', format => {
      result.format = format

      reader.on('data', chunk => {
        raw.push(chunk)
      })
    })

    input.on('end', () => {
      result.data = Buffer.concat(raw)

      resolve(result)
    })

    input.pipe(reader)

    input.end(wav)
  })
}

module.exports = wavToRaw
