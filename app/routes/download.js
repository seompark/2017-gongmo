const { Router } = require('express')
const auth = require('../src/auth')
const path = require('path')
const Team = require('../src/db/Team')
const config = require('../../config')
const filePath = path.resolve(config.content, 'files')

const router = new Router()

router.get('/:teamIdx/:type', auth.verifyPermission('S', false), (req, res) => {
  const { teamIdx, type } = req.params

  Team.findByTeamIdx(teamIdx)
    .then(team => {
      if (!team) return res.status(404).render('404')
      if (
        (req.user.serial !== team.leader.serial) &&
        !auth.hasPermission(req.user.userType, 'T') &&
        (req.user.id !== '1269')
      ) return res.status(403).render('error')

      const file = team.files
        .filter(v => v.type === type)[0]

      file
        ? res.download(path.resolve(filePath, file.hash), file.originalName)
        : res.attachment('blank') && res.end() // 왜 404로 안 했는지 모르겠음
    })
    .catch(console.error)
})

module.exports = router
