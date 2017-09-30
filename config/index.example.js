const path = require('path')

module.exports = {
  secret: 'I\'m SECRET!!',
  port: 8080,
  dimigo: {
    host: '',
    username: 'user',
    password: 'pwd'
  },
  db: {
    host: 'localhost',
    port: '',
    username: '',
    password: '',
    database: ''
  },
  content: path.resolve(__dirname, '..', 'content/files')
}
