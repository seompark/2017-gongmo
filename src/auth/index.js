const config = require('../../config')
const dimi = new (require('dimigo'))({
  host: config.host,
  user: config.dimigo.user,
  password: config.dimigo.password
})

module.exports.verifyUser = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/' + req.session.redirectTo)
  }
  return next()
}

module.exports.identifyUser = async (name, password) => {
  const result = await dimi.identifyUser(name, password)
  if (result.status === 404) {
    return false
  }
  return result
}
