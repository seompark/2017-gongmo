const fs = require('fs')
const path = require('path')
const Router = require('express').Router
const archiver = require('archiver')
const multer = require('multer')
const router = new Router()
const Team = require('../src/db/Team')
const File = require('../src/db/File')

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

router.get('/download', (req, res) => {
  const zip = path.join(__dirname, 'content/data/download.zip')
  const output = fs.createWriteStream(zip)
  const archive = archiver('zip')

  output.on('close', () => {
    res.download(zip)
  })
  archive.pipe(output)

  ;(async () => {
    const teams = await Team.getList()
    // 파일이 존재하면
    for (const team in teams) {
      if (team.file.formfile || team.file.sourcefile) {
        // 파일을 가져옴
        const file = await File.findByLeaderId(team.leader_id)
        // 소스파일 처리
        Object.values(file).forEach(file => {
          if (!file) return
          archive.file(
            path.join(config.content, 'files', file.sourcefile.hash),
            path.join(
              `${team.name} - ${team.leader_id} ${team.leader_name}`,
              file.originalName
            )
          )
        })
      }
    }
  })().then(() => {
    archive.finalize()
  })
})

router.route('/notice')
  .get((req, res) => {
    // TODO
    res.render('admin/notice', {
      notices: []
    })
  })
  .post((req, res) => {
    // TODO
  })

module.exports = router
