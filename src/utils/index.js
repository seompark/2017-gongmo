const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const config = require('../../config')

const storage = multer.diskStorage({
  destination (req, file, callback) {
    callback(null, path.resolve(config.content, 'files'))
  },
  filename (req, file, callback) {
    callback(null,
      crypto.createHmac('sha256', Math.random().toString())
        .update(Date.now().toString())
        .digest('hex') + path.extname(file.originalname))
  }
})

exports.storage = storage
