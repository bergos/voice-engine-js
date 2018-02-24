const fetch = require('node-fetch')
const wavToRaw = require('./wavToRaw')
const Transform = require('stream').Transform

class GoogleSpeechToText extends Transform {
  constructor (options) {
    options = options || {}

    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.apiKey = options.apiKey || process.env.GOOGLE_API_KEY
  }

  _transform (chunk, encoding, callback) {
    wavToRaw(chunk).then(raw => {
      return fetch('https://speech.googleapis.com/v1/speech:recognize?key=' + this.apiKey, {
        method: 'post',
        headers: {
          accept: 'application/json',
          'content-type': `audio/${raw.format.endianness.slice(0, 1).toLowerCase() + raw.format.bitDepth}; rate=${raw.format.sampleRate};`
        },
        body: JSON.stringify({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: raw.format.sampleRate,
            languageCode: 'en-US',
            maxAlternatives: 30,
            enableWordTimeOffsets: false
          },
          audio: {
            content: raw.data.toString('base64')
          }
        })
      }).then(res => {
        if (res.ok) {
          return res.json()
        } else {
          return Promise.reject(res.statusText)
        }
      }).then(json => {
        if (json.error) {
          return Promise.reject(json.error.message)
        } else {
          return json.results.shift().alternatives.map(alternative => {
            return {
              confidence: alternative.confidence,
              text: alternative.transcript
            }
          })
        }
      })
    }).then(result => {
      callback(null, result)
    }).catch(err => {
      callback(null, [{
        confidence: 0,
        error: err
      }])
    })
  }
}

module.exports = GoogleSpeechToText
