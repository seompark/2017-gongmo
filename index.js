const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const logger = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')

const config = require('./config')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || config.port
const storeOption = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database.session
}
const sessionStore = new MySQLStore(storeOption)
const sess = {
  secret: config.secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: false
}

app.use(logger('dev'))
app.use(helmet())
app.use(compression())
app.use(session(sess))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('static'))

routes(app)

app.listen(port, () => console.log(`App listens on port ${port}`))
console.log(process.env.NODE_ENV)
