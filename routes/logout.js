const Router = require('express').Router
const router = new Router()

router.route('/')
.post((req, res) => {
  req.session.user = null
  res.redirect('/')
})

module.exports = router
