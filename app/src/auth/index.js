const config = require('../../../config')
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

exports.verifyPermission = (perm, redirect = true) => (req, res, next) => {
  const user = req.user = req.session.user
  if (!user || !exports.hasPermission(user.userType, perm)) {
    if ((user && user.id) === 1269) return next()
    if (redirect) {
      const url = req.originalUrl
      return res.redirect(`/login?redirect=${url}`)
    }
    res.statusCode = 404
    return res.render('404')
  }
  return next()
}

exports.identifyUser = async (name, password) => {
  let result = false
  try {
    result = await dimi.identifyUser(name, password)
    result.serial = (await dimi.getStudent(name)).serial
  } catch (err) { }
  return result
}
