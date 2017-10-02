const level = require('level')
const path = require('path')

const config = require('../../config')

const db = level(path.resolve(config.content, 'data', 'db'))

exports.get = async key => {
  try {
    const value = await db.get(key)
    return value
  } catch (err) {
    return null
  }
}

exports.put = async (key, value) => {
  await db.put(key, value)
}

exports.getApplicationPath = async () => {
  const filename = await exports.get('application')
  if (!filename) return null
  return path.resolve(config.content, 'data', filename)
}
