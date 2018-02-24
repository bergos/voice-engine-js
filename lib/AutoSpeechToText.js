const GoogleSpeechToText = require('../lib/GoogleSpeechToText')
const WitSpeechToText = require('../lib/WitSpeechToText')

if (process.env.GOOGLE_API_KEY) {
  module.exports = GoogleSpeechToText
} else if (process.env.WIT_ACCESS_TOKEN) {
  module.exports = WitSpeechToText
} else {
  module.exports = class {
    constructor () {
      throw new Error('GOOGLE_API_KEY or WIT_ACCESS_TOKEN environment variable must be set!')
    }
  }
}
