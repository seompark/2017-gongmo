const knex = require('./knex')
const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const unlink = promisify(fs.unlink)

const config = require('../../../config')

class File {
  /**
   * Creates an instance of File.
   * @param {{type: string, originalName: string, hash: string, leaderId: number }}
   */
  constructor ({ type, originalName, hash, leaderId }) {
    this.type = type
    this.originalName = originalName
    this.hash = hash
    this.leaderId = leaderId
  }

  static get TYPE () {
    return {
      FORM_FILE: 'formfile', // 신청서
      SOURCE_FILE: 'sourcefile' // 실행 파일 및 코드
    }
  }

  valueOf () {
    return {
      type: this.type,
      original_name: this.originalName,
      hash: this.hash,
      leader_id: this.leaderId
    }
  }

  verifyData () {
    if (!(this.type && this.originalName && this.hash && this.leaderId)) {
      throw new Error(`Invalid data : ${JSON.stringify(this.valueOf(), null, 2)}`)
    }
  }

  async save () {
    this.verifyData()
    await knex('files').insert(this.valueOf())
  }

  /**
   *
   * @param {String} leaderId
   * @returns {Promise<{string, File}>}
   */
  static async findByLeaderId (leaderId) {
    const result = await knex('files').select().where({ leader_id: leaderId })
    return result.reduce((pv, cv) => {
      pv[cv.type] = new File({
        type: cv.type,
        leaderId: cv.leader_id,
        originalName: cv.original_name,
        hash: cv.hash
      })
      return pv
    }, {})
  }

  static async deleteLatest (leaderId, type) {
    const files = await File.findByLeaderId(leaderId)
    type ? files[type].delete() : files.forEach(v => v.delete())
  }

  async delete () {
    try {
      await knex('files').where({ hash: this.hash }).delete()
      await unlink(path.resolve(config.content, 'files', this.hash))
    } catch (err) { throw new Error(`Failed to delete file : ${this.hash}`) }
  }
}

module.exports = File