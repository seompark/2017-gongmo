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

module.exports.verifyPermission = (perm, redirect = true) => (req, res, next) => {
  console.log(req.session.user)
  const user = req.user = req.session.user
  if (!user || !(TYPE[user.userType] >= TYPE[perm])) {
    if (redirect) {
      const url = req.originalUrl
      return res.redirect(`/login?redirect=${url}`)
    }
    return res.redirect('/404')
  }
  return next()
}

module.exports.identifyUser = async (name, password) => {
  let result = false
  try {
    result = await dimi.identifyUser(name, password)
  } catch (err) { }
  return result
}
