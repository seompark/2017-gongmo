const path = require('path')
require('dotenv').config()

module.exports = {
  secret: process.env.COOKIE_SECRET,
  port: process.env.APP_INTERNAL_PORT || 3000,
  dimigo: {
    host: process.env.DIMIGO_API_HOST,
    username: process.env.DIMIGO_API_USERNAME,
    password: process.env.DIMIGO_API_PASSWORD
  },
  db: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_INTERNAL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },
  content: path.resolve(__dirname, '..', 'content'),
  period: {
    start: new Date(2018, 11 - 1, 10),
    end: new Date(2018, 12 - 1, 16, 23)
  }
}
