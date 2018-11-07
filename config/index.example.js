const path = require('path')
require('dotenv').config()

module.exports = {
  secret: process.env.COOKIE_SECRET,
  port: 3000,
  dimigo: {
    host: process.env.DIMIGO_API_HOST,
    username: process.env.DIMIGO_API_USERNAME,
    password: process.env.DIMIGO_API_PASSWORD
  },
  db: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },
  content: path.resolve(__dirname, '..', 'content')
}
