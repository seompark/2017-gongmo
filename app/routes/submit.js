const Router = require('express').Router
const multer = require('multer')
const router = new Router()
const Team = require('../src/db/Team')
const File = require('../src/db/File')
const auth = require('../src/auth')
const { storage } = require('../src/utils')

const upload = multer({ storage })
const fileupload = upload.fields([{ name: 'formfile', maxCount: 1 }, { name: 'sourcefile', maxCount: 1 }])

router.route('/')
  .get((req, res) => {
    res.redirect('/') // 마감
    /*
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
      */
  })
  .post((req, res, next) => {
    res.setTimeout(1000 * 60 * 10, () => {
      console.error('request has time out')
      res.send(408)
    })
    next()
  }, fileupload, (req, res) => {
    return res.end() // 마감
    /*
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
      */
  })

router.get('/success', (req, res) => {
  res.render('submit-success', {
    user: req.user
  })
})

router.delete('/delete/:serial', (req, res) => {
  if (!auth.hasPermission(req.user.userType, 'T') && req.user.serial !== req.params.serial) {
    return res.json({
      error: {
        code: 'ERR_NO_PERMISSION',
        message: '권한이 없습니다.'
      }
    })
  }
  Team.findByLeaderId(req.params.serial)
    .then(team =>
      team.delete()
        .then(() => File.deleteLatest(req.params.serial))
        .then(() => res.json({ success: true }))
        .catch(err => { throw err }))
    .catch(err => {
      console.error(err)
      res.json({
        error: {
          code: 'ERR_DB',
          message: '데이터베이스가 아파요.'
        }
      })
    })
})

module.exports = router