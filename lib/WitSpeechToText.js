const fetch =  require('node-fetch')
const Transform = require('stream').Transform

class WitSpeechToText extends Transform {
  constructor (options) {
    options = options || {}

    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.accessToken = options.accessToken || process.env.WIT_ACCESS_TOKEN
  }

  _transform (chunk, encoding, callback) {
    fetch('https://api.wit.ai/speech', {
      method: 'post',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer ' + this.accessToken,
        'content-type': 'audio/wav'
      },
      body: chunk
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(res.statusText)
      } else {
        return res.json()
      }
    }).then(json => {
      if (json.error) {
        return Promise.reject(json.error)
      } else {
        return [{
          confidence: 1,
          text: json._text
        }]
      }
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

module.exports = WitSpeechToText
