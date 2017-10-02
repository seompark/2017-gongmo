const knex = require('./knex')
const moment = require('moment')

class Team {
  /**
   * @typedef {Object} Team
   * @property {Object} leader
   * @property {Array<Object>} followers
   * @property {string} description
   * @property {{originalName: string, hash: string}} file
   *
   * @param {Team} team
   */
  constructor ({
    leader,
    name,
    followers = [],
    description = ''
  }) {
    this.name = name || leader.name
    this.leader = leader
    this.followers = followers
    this.description = description
  }

  valueOf () {
    return {
      team: {
        name: this.name,
        leader_id: this.leader.id,
        leader_name: this.leader.name,
        description: this.description
      },
      followers: this.followers
        .map(v => ({
          leader_id: this.leader.id,
          id: v.id,
          name: v.name,
          priority: v.priority
        }))
    }
  }

  /**
   * DB에 저장
   * @returns {Promise}
   */
  async save () {
    this.verifyData()
    const teamQuery = knex('teams').where({ leader_id: this.leader.id })
    const followersQuery = knex('followers').where({ leader_id: this.leader.id })
    const value = this.valueOf()

    await followersQuery.delete()
    await knex('followers').insert(value.followers)
    if ((await teamQuery.select()).length > 0) {
      await teamQuery.update(value.team)
      return
    }

    await knex('teams').insert(value.team)
  }

  async delete () {
    const teamQuery = knex('teams').where({ leader_id: this.leader.id })
    const followersQuery = knex('followers').where({ leader_id: this.leader.id })
    await followersQuery.delete()
    await teamQuery.delete()
  }

  verifyData () {
    let err = null
    if (!(this.followers instanceof Array)) err = TypeError(`Invalid type: followers should be Array but ${this.followers.constructor}.`)
    if (this.name.constructor !== String) err = new TypeError(`Invalid type: name should be String but ${this.name.constructor}.`)
    if (!this.leader) err = new Error('Invalid data: leader should be Object.')
    if (this.leader.name.constructor !== String) err = new TypeError(`Invalid type: leader.name should be String but ${this.leader.name.constructor}.`)
    if (isNaN(Number(this.leader.id))) err = new TypeError(`Invalid type: leader.id should be Number but ${this.leader.id.constructor}.`)
    this.followers.forEach(v => {
      if (v.name && v.id && v.priority) {
        if (v.name.constructor !== String) err = new TypeError('Invalid type: follower.name which is in followers should be string.')
        if (isNaN(Number(v.id))) err = new TypeError('Invalid type: follower.id which is in followers should be number.')
        if (isNaN(Number(v.priority))) err = new Error('Invalid type: follower.priority which is in followers should be number.')
        if (v.priority < 1 || v.priority > 3) err = new Error('Invalid data : follower.id which is in followers should be bigger than 0 and smaller than 5.')
      } else {
        err = new Error('Not allowed null or undefined data.')
      }
    })
    if (err) throw err
  }

  /**
   * 팀장 학번으로 팀 정보를 가져온다.
   * @param {number} id
   * @returns {Promise.<Team>}
   */
  static async findByLeaderId (id) {
    const followers = await knex('followers').where({ leader_id: id }).select()
    const tm = (await knex('teams').where({ leader_id: id }).select())[0]
    if (!tm) return null
    return new Team({
      leader: { id: tm.leader_id, name: tm.leader_name },
      name: tm.name,
      followers,
      description: tm.description
    })
  }

  /**
   * 모든 팀 정보를 가져온다.
   * TODO
   * @returns {Promise.<Object, Error>}
   */
  static async getList () {
    const teams = await knex('teams').select()

    return Promise.all(teams.reduce((pv, cv) => {
      pv.push(new Promise((resolve, reject) => {
        knex('followers')
          .select()
          .where({leader_id: cv.leader_id})
          .then(followers => {
            resolve({
              name: cv.name,
              leader: {
                id: cv.leader_id,
                name: cv.leader_name
              },
              description: cv.description,
              updatedAt: moment(cv.updated_at).format('MM월 DD일 hh시 mm분'),
              followers
            })
          })
      }))
      return pv
    }, []))
  }
}

module.exports = Team
