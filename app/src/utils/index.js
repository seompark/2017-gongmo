const config = require('../../../config')

module.exports = {
  isPeriod: (now = new Date()) => (config.period.start < now && config.period.end > now)
}
