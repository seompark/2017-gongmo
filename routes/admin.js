const auth = require('../src/auth')

module.exports = app => {
  app.get('/admin', auth.verifyPermission, (req, res) => {
    res.render('admin', { user: req.session.user })
  })
}
