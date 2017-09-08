const config = require('../../config')
const Dimigo = require('dimigo')
const dimi = new Dimigo(config.dimigo)

module.exports.verifyPermission = (req, res, next) => {
  console.log(req.session.user)
  if (!req.session.user) {
    return res.redirect('/login')
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
