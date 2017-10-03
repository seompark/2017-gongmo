const Router = require('express').Router
const multer = require('multer')
const router = new Router()
const Team = require('../src/db/Team')
const path = require('path')

const config = require('../config/index')

const storage = multer.diskStorage({
  destination (req, file, callback) {
    callback(null, path.resolve(config.content, 'data'))
  },
  filename (req, file, callback) {
    callback(null, `application${path.extname(file.originalName)}`)
  }
})
const uploadApplication = multer({ storage })

router.get('/', (req, res) => res.redirect('/admin/dashboard'))

router.route('/dashboard')
  .get((req, res) => {
    Team.getList().then(r => {
      res.render('admin/dashboard', {
        teams: r,
        user: req.user
      })
    }).catch(_ => {
      console.log(_)
      res.status(400)
      res.end()
    })
  })

router.route('/settings')
  .get((req, res) => {
    res.render('admin/settings', {
      user: req.user
    })
  })

router.route('/notice')
  .get((req, res) => {
    res.render('admin/notice', {
      user: req.user
    })
  })

// API //
router.route('/u/application')
  .post(uploadApplication.single('application'), (req, res) => {

  })

router.route('/u/notice')
  .post((req, res) => {

  })

module.exports = router
