const knex = require('./knex')
const moment = require('moment')

module.exports = class Notice {
  constructor (message) {
    this.message = message
  }

  /**
   * @returns {Promise.<number, Error>}
   */
  save () {
    return knex('notices')
      .returning('id')
      .insert({ message: this.message })
  }

  static async get (id) {
    const notices = await knex('notices').where({ id }).select()
    if (notices.length < 1) {
      return null
    } else {
      return notices[0]
    }
  }

  static async delete (id) {
    await knex('notices').where({ id }).del()
  }

  static async getList () {
    const notices = await knex('notices').select()
    return notices.map(v => ({
      message: v.message,
      id: v.id,
      time: moment(v.created_at).format('MM월 DD일 hh:mm')
    })).reverse()
  }
}
