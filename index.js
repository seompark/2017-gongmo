const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const logger = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')

const config = require('./config')
const routes = require('./routes')

const path = require('path')

const app = express()
const port = process.env.PORT || config.port
const storeOption = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database.session
}
const sess = {
  secret: config.secret,
  store: new MySQLStore(storeOption),
  resave: true,
  saveUninitialized: false
}

app.set('views', path.resolve(__dirname, 'views'))
app.set('static', path.resolve(__dirname, 'dist'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(helmet())
app.use(compression())
app.use(session(sess))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(app.get('static')))

routes(app)

app.listen(port, () => console.log(`App listens on port ${port}`))
