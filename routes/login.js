const Router = require('express').Router
const router = new Router()
const auth = require('../src/auth')

router.route('/')
.get((req, res) => {
  if (req.session.user) {
    return res.redirect(`/${req.query.redirect || ''}`)
  }
  req.session.redirectTo = req.query.redirect || '/'
  res.render('login')
})
.post((req, res) => {
  auth.identifyUser(req.body.id, req.body.password)
  .then(result => {
    if (!result) {
      req.flash('error', '잘못된 아이디 혹은 비밀번호입니다.')
      return res.redirect('/login')
    }
    req.session.user = result
    res.redirect(req.session.redirectTo)
  })
  .catch(console.error)
})

module.exports = router
