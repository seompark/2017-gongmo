const auth = require('../src/auth')

module.exports = app => {
  app.use('/admin', auth.verifyPermission('T'))

  app.route('/admin')
    .get((req, res) => {
      res.render('admin', {user: req.user})
    })

  app.route('/admin/forms')
    .get((req, res) => {

    })

  app.route('/admin/forms/download')
    .get((req, res) => {

    })
}
