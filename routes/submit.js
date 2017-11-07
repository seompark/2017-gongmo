const Router = require('express').Router
const multer = require('multer')
const crypto = require('crypto')
const config = require('../config')
const router = new Router()
const Team = require('../src/db/Team')
const File = require('../src/db/File')
const path = require('path')
const storage = multer.diskStorage({
  destination (req, file, callback) {
    callback(null, path.resolve(config.content, 'files'))
  },
  filename (req, file, callback) {
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
    Team.findByLeaderId(req.user.serial)
      .then(team => {
        if (!team) {
          return res.render('submit', { user: req.user })
        }
        res.render('submit', {
          user: req.user,
          contact: team.leader.contact,
          followers: team.followers,
          name: team.name,
          description: team.description,
          formfile: !!team.file[File.TYPE.FORM_FILE],
          sourcefile: !!team.file[File.TYPE.SOURCE_FILE]
        })
      })
      .catch(err => {
        console.error(err)
        res.render('error')
      })
  })
  .post(fileupload, (req, res) => {
    const body = req.body
    if (!body) {
      const error = new Error('No data recieved')
      error.code = 'ERR_NO_DATA'
      throw error
    }

    const leader = {
      name: req.user.name,
      id: req.user.serial,
      contact: body.contact
    }
    const { name, followers, description } = body

    new Team({
      name,
      leader,
      followers: JSON.parse(followers),
      description
    }).save()
      .then(async () => {
        if (Object.keys(req.files).length < 1) return Promise.resolve()
        for (const type of Object.keys(req.files)) {
          const file = req.files[type][0]
          await File.deleteLatest(req.user.serial, type)
          await new File({
            type,
            hash: file.filename,
            originalName: file.originalname,
            leaderId: req.user.serial
          }).save()
        }
      })
      .then(() => {
        res.json({
          success: true,
          error: null
        })
      })
      .catch(err => {
        if (err.code === 'ERR_DUP_TEAMNAME') {
          res.json({
            success: false,
            error: {
              code: 'ERR_DUP_TEAMNAME',
              message: '중복되는 팀명입니다.'
            }
          })
        } else {
          console.error(err)
          res.json({
            success: false,
            error: {
              code: 'ERR_INTERNAL',
              message: '무언가 잘못됐어요 ㅠㅠ'
            }
          })
        }
      })
  })

router.get('/success', (req, res) => {
  res.render('submit-success', {
    user: req.user
  })
})

module.exports = router
