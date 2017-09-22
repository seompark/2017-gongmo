const hash = require('hash.js')

module.exports = v => hash.sha256().update(v).digest('hex')
