const Router = require('express').Router
const router = new Router()
const Team = require('../src/db/Team')

router.route('/')
.get((req, res) => {
  Team.findByLeaderId(req.user.serial).then(t => {
    res.render('submit', {
      user: req.session.user,
      followers: t.followers,
      name: t.name,
      description: t.description
    })
  })
  .catch(_ => {
    console.log(_)
    res.render('error', {
      message: 'Database Error'
    })
  })
})
.post((req, res) => {
  const body = req.body
  if (!body) {
    return res.json({ success: false, error: 'INVALID' })
  }
  const leader = {
    name: req.user.name,
    id: req.user.serial
  }
  const { name, followers, description } = body
  const team = new Team({
    name,
    leader,
    followers,
    description
  })

  team.save()
  .then(() => {
    res.json({
      success: true,
      error: null
    })
  })
  .catch(err => {
    res.json({
      success: false,
      error: err
    })
  })
})

module.exports = router
