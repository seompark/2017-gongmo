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
  constructor ({ idx, type, originalName, hash, teamIdx }) {
    this.idx = idx
    this.type = type
    this.originalName = originalName
    this.hash = hash
    this.teamIdx = teamIdx
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
      team_idx: this.teamIdx
    }
  }

  verifyData () {
    if (!(this.type && this.originalName && this.hash && this.teamIdx)) {
      throw new Error(`Invalid data : ${JSON.stringify(this.valueOf(), null, 2)}`)
    }
  }

  async save () {
    this.verifyData()
    await knex('files').insert(this.valueOf())
  }

  static format (file) {
    return {
      idx: file.idx,
      hash: file.hash,
      originalName: file.original_name,
      type: file.type,
      teamIdx: file.team_idx
    }
  }

  /**
   *
   * @param {Number} idx
   * @returns {Promise<{string, File}>}
   */
  static async findByTeamIdx (idx) {
    const files = await knex('files').select().where({ team_idx: idx })
    return files.map(File.format).map(v => new File(v))
  }

  static async findByLeaderSerial (serial) {
    const team = (await knex('teams').select().where({ leader_serial: serial }))[0]
    return File.findByTeamIdx(team.idx)
  }

  static async deleteLatest (teamIdx, type) {
    const files = await File.findByTeamIdx(teamIdx)
    files.filter(v => type && (v.type === type)).forEach(v => v.delete())
  }

  async delete () {
    try {
      await knex('files').where({ hash: this.hash }).delete()
      await unlink(path.resolve(config.content, 'files', this.hash))
    } catch (err) { throw new Error(`Failed to delete file : ${this.hash}`) }
  }
}

module.exports = File
