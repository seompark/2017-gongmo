const Router = require('express').Router
const multer = require('multer')
const hash = require('../src/utils/hash')
const config = require('../config')
const router = new Router()
const Team = require('../src/db/Team')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.formPath)
  },
  filename: (req, file, callback) => {
    callback(null, hash(req.user.id + Date.now()))
  }
})

const upload = multer({ storage })

router.route('/')
  .get((req, res) => {
    Team.findByLeaderId(req.user.serial)
      .then(t => {
        res.render('submit', {
          user: req.session.user,
          followers: t.followers,
          name: t.name,
          description: t.description
        })
      })
      .catch(_ => {
        console.error(_)
        res.render('error', {
          message: 'Database Error'
        })
      })
  })
  .post(upload.single('formfile'), (req, res) => {
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
      followers: JSON.parse(followers),
      description,
      file: {
        name: req.file.filename,
        originalName: req.file.originalname
      }
    })

    team.save()
      .then(() => {
        res.json({
          success: true,
          error: null
        })
      })
      .catch(err => {
        console.error(err)
        res.json({
          success: false,
          error: err
        })
      })
  })

module.exports = router
