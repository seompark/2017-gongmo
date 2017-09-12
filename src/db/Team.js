const knex = require('./knex')
const team = knex('teams')
const follower = knex('followers')

module.exports = class {
  /**
   * @typedef {Object} Team
   * @property {number} leaderId
   * @property {Array<Object>} followers
   * @property {string} formPath
   * @property {string} serviceDomain
   *
   * @param {Team} team
   */
  constructor ({name, leaderId, followers, formPath, serviceDomain}) {
    this.name = name
    this.leaderId = leaderId
    this.followers = followers
    this.formPath = formPath
    this.serviceDomain = serviceDomain
  }

  /**
   * DB에 저장
   * @returns {Promise}
   */
  async save () {
    await team.insert({
      name: this.name,
      leader: this.leaderId,
      form_path: this.formPath,
      serviceDomain: this.serviceDomain
    })
    for (const value in this.followers) {
      follower.insert({
        id: value.id,
        name: value.name
      })
    }
  }

  /**
   * 팀장 학번으로 팀 정보를 가져온다.
   * @param {string} id
   * @returns {Promise}
   */
  static async findByLeaderId (id) {
    const followers = await team.slect().where({ leaderId: id })
    return followers
  }
}
