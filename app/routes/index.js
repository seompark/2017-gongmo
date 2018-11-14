const path = require('path')
const auth = require('../src/auth')

module.exports = app => {
  app.route('/')
    .get((req, res) => {
      if (req.user && auth.hasPermission(req.user.userType, 'T')) return res.redirect('/admin')
      res.redirect('/submit')
    })

  app.use('/download', auth.verifyPermission('S'))
  app.route('/download')
    .get((req, res) => {
      res.sendFile(path.resolve('../', 'contents/file/download.hwp'))
    })

  app.use('/login', require('./login'))
  app.use('/logout', require('./logout'))
  app.use('/submit', auth.verifyPermission('S'), require('./submit'))
  app.use('/admin', auth.verifyPermission('T', false), require('./admin'))
  app.use('/download', require('./download'))
}
