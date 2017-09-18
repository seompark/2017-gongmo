const Router = require('express').Router
const router = new Router()

router.route('/')
.get((req, res) => {
  res.render('admin', { user: req.user || req.session.user })
})

router.route('/forms')
.get((req, res) => {

})

router.route('/forms/download')
.get((req, res) => {

})

module.exports = router
