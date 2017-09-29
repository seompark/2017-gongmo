const knex = require('./knex')

class File {
  constructor ({ originalName, hash, leaderId }) {
    this.originalName = originalName
    this.hash = hash
    this.leaderId = leaderId
  }

  valueOf () {
    return {
      original_name: this.originalName,
      hash: this.hash,
      leader_id: this.leaderId
    }
  }

  async save () {
    await knex.insert(this.valueOf())
  }
}

module.exports = File
