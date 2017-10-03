const { Router } = require('express')
const auth = require('../src/auth')
const path = require('path')
const File = require('../src/db/File')
const admin = require('../src/admin')

const config = require('../config')
const filePath = path.resolve(config.content, 'files')

const router = new Router()

router.route('/application')
  .get(auth.verifyPermission('S'), (req, res) => {
    admin.getApplicationPath().then(r => {
      if (!r) return res.render('404')
      res.download(r)
    })
  })

router.get('/form/:leaderId', auth.verifyPermission('S', false), (req, res) => {
  const id = req.params.leaderId
  if (req.user.serial !== id && !auth.hasPermission(req.user.userType, 'T')) {
    return res.render('404')
  }
  File.findByLeaderId(id)
    .then(r => {
      if (!r.formfile) return res.attachment('blank') && res.end()
      res.download(path.resolve(filePath, r.formfile.hash), r.formfile.originalName)
    })
    .catch(err => console.error(err))
})

router.get('/source/:leaderId', (req, res) => {
  const id = req.params.leaderId
  if (req.user.serial !== id && !auth.hasPermission(req.user.userType, 'T')) {
    return res.render('404')
  }
  File.findByLeaderId(id)
    .then(r => {
      if (!r.sourcefile) return res.attachment('blank') && res.end()
      res.download(path.resolve(filePath, r.sourcefile.hash), r.sourcefile.originalName)
    })
    .catch(err => console.error(err))
})

module.exports = router
