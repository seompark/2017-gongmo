const config = require('./config')

module.exports = {
  client: 'mysql',
  connection: {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.username,
    password: config.db.password
  }
}
