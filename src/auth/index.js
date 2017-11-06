const config = require('../../config')
const Dimigo = require('dimigo')
const dimi = new Dimigo(config.dimigo)

const TYPE = {
  'T': Infinity,
  'D': Infinity,
  'S': 0,
  'P': 1,
  'O': 0
}

exports.hasPermission = (experiment, control) => {
  return TYPE[experiment] >= TYPE[control]
}

module.exports.verifyPermission = (perm, redirect = true) => (req, res, next) => {
  const user = req.user = req.session.user
  if (!user || !exports.hasPermission(user.userType, perm)) {
    if (redirect) {
      const url = req.originalUrl
      return res.redirect(`/login?redirect=${url}`)
    }
    return res.render('404')
  }
  return next()
}

module.exports.identifyUser = async (name, password) => {
  let result = false
  try {
    result = await dimi.identifyUser(name, password)
    result.serial = (await dimi.getStudent(name)).serial
  } catch (err) { }
  return result
}
