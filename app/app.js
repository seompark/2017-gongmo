const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('express-flash')
const favicon = require('serve-favicon')
// const FileStore = require('session-file-store')(session)

const config = require('../config')
const knexconfig = require('../knexfile')
const knex = require('./src/db/knex')
const routes = require('./routes')

const path = require('path')

knex.migrate.latest([knexconfig])

const app = express()
const port = process.env.PORT || config.port
const sess = {
  secret: config.secret,
  // store: new FileStore(),
  resave: true,
  saveUninitialized: false
}

app.set('views', path.resolve(__dirname, 'views'))
app.set('static1', path.resolve(__dirname, '../dist'))
app.set('static2', path.resolve(__dirname, '../public'))
app.set('view engine', 'pug')

app.use(helmet())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '200MB'
}))
app.use(bodyParser.json({ limit: '200MB' }))
app.use(cookieParser())
app.use(session(sess))
app.use(express.static(app.get('static1')))
app.use(express.static(app.get('static2')))
app.use(favicon(path.resolve(app.get('static2'), 'favicon.ico')))
app.use(compression())
app.use(flash())

routes(app)

app.use((req, res) => {
  res.status(404)
  res.render('404')
})

app.use((err, req, res, next) => {
  res.render('error')
  console.error(err)
})

app.listen(port, () => console.log(`App listens on port ${port}`))

process.on('SIGINT', err => {
  process.exit(err ? 1 : 0)
})
