const knex = require('./knex')

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
      FORM_FILE: 'formfile',
      SOURCE_FILE: 'sourcefile'
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

  static async findByLeaderId (leaderId) {
    const result = await knex('files').select().where({ leader_id: leaderId })
    return result.reduce((pv, cv) => {
      pv[cv.type] = {
        originalName: cv.original_name,
        hash: cv.hash
      }
      return pv
    }, {})
  }

  async delete () {

  }
}

module.exports = File
