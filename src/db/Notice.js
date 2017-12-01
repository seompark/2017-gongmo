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
    return [{
      message: '창의 IT 공모전 접수가 시작되었습니다. 아래 양식을 다운받아서 제출해주세요.',
      id: -1,
      pinned: true,
      files: [{
        name: '개발요약서 양식 (워드)',
        link: 'https://dl.getdropbox.com/s/3h1t4xgb9wuk9uw/%EC%B2%A8%EB%B6%80%201%20%EA%B3%84%EB%B0%9C%EC%9A%94%EC%95%BD%EC%84%9C.docx'
      }, {
        name: '개발요약서 양식 (한글)',
        link: 'https://dl.getdropbox.com/s/jp1kip1napr40rf/%EC%B2%A8%EB%B6%80%201%20%EA%B3%84%EB%B0%9C%EC%9A%94%EC%95%BD%EC%84%9C.hwp'
      }]
    }].concat(
      (await knex('notices').select())
        .map(v => ({
          message: v.message,
          id: v.id,
          time: moment(v.created_at).format('MM월 DD일 hh:mm')
        }))
        .reverse()
    )
  }
}
