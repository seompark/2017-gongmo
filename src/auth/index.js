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

module.exports.verifyPermission = perm => (req, res, next) => {
  const user = req.user = req.session.user
  if (!user) {
    const redirect = req.originalUrl
    return res.redirect(`/login?redirect=${redirect}`)
  }
  console.log(TYPE[user.userType], TYPE[perm])
  if (!(TYPE[user.userType] >= TYPE[perm])) {
    res.status(401)
    return res.end()
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
