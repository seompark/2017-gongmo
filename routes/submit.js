const Router = require('express').Router
const multer = require('multer')
const crypto = require('crypto')
const config = require('../config')
const router = new Router()
const Team = require('../src/db/Team')
const File = require('../src/db/File')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(config.content, 'files'))
  },
  filename: (req, file, callback) => {
    callback(null,
      crypto.createHmac('sha256', Math.random().toString())
        .update(Date.now().toString())
        .digest('hex') + path.extname(file.originalname))
  }
})

const upload = multer({ storage })
const fileupload = upload.fields([{ name: 'formfile', maxCount: 1 }, { name: 'sourcefile', maxCount: 1 }])

router.route('/')
  .get((req, res) => {
    Promise.all([
      Team.findByLeaderId(req.user.serial),
      File.findByLeaderId(req.user.serial)
    ])
      .then(result => {
        res.render('submit', {
          user: req.session.user,
          followers: result[0].followers,
          name: result[0].name,
          description: result[0].description,
          formfile: result[1].form,
          sourcefile: result[1].source
        })
      })
      .catch(_ => {
        console.error(_)
        res.render('error', {
          message: 'Database Error'
        })
      })
  })
  .post(fileupload, (req, res) => {
    const body = req.body
    if (!body) {
      return res.json({ success: false, error: 'No data recieved' })
    }

    const leader = {
      name: req.user.name,
      id: req.user.serial
    }
    const { name, followers, description } = body

    const promises = []

    const pendingFileSave = (s, type) => {
      if (!req.files[s]) return
      const file = req.files[s][0]
      promises.push(new File({
        type,
        hash: file.filename,
        originalName: file.originalname,
        leaderId: req.user.serial
      }).save())
    }

    promises.push(new Team({
      name,
      leader,
      followers: JSON.parse(followers),
      description
    }).save())
    promises.push(File.deleteLatest(req.user.serial))
    pendingFileSave('formfile', File.TYPE.FORM_FILE)
    pendingFileSave('sourcefile', File.TYPE.SOURCE_FILE)

    Promise.all(promises)
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
