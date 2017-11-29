const path = require('path')
const auth = require('../src/auth')
const Notice = require('../src/db/Notice')

module.exports = app => {
  app.route('/')
    .get((req, res) => {
      Notice.getList()
        .then(notices => {
          res.render('index', {
            user: req.session.user,
            notices
          })
        })
        .catch(err => {
          console.error(err)
          res.render('error')
        })
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
