const Router = require('express').Router
const router = new Router()
const Team = require('../src/db/Team')

router.route('/')
.get((req, res) => {
  Team.getList().then(r => {
    res.render('admin', {
      teams: r,
      user: req.user
    })
  }).catch(_ => {
    res.status(400)
    res.end()
  })
})

router.route('/settings')
  .get((req, res) => {

  })
  .post((req, res) => {

  })

module.exports = router
