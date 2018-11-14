const knex = require('./knex')
const moment = require('moment')
const File = require('./File')

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
    idx,
    leader,
    name,
    followers = [],
    description = '',
    files = [],
    updatedAt
  }) {
    this.idx = idx
    this.name = name
    this.leader = leader
    this.followers = followers
    this.description = description
    this.files = files
    this.updatedAt = updatedAt
  }

  valueOf () {
    return {
      team: {
        idx: this.idx,
        name: this.name,
        leader_serial: this.leader.serial,
        leader_name: this.leader.name,
        leader_contact: this.leader.contact,
        description: this.description
      },
      followers: this.followers
        .map(v => ({
          team_idx: this.idx,
          serial: v.serial,
          name: v.name,
          contact: v.contact,
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
    if ((await knex('teams')
      .where({ name: this.name })
      .whereNot({ leader_serial: this.leader.serial })).length > 0) {
      const error = new Error('중복되는 팀 이름입니다.')
      error.code = 'ERR_DUP_TEANAME'
      throw error
    }
    const teamQuery = knex('teams').where({ leader_serial: this.leader.serial })
    const followersQuery = knex('followers').where({ leader_serial: this.leader.serial })
    const value = this.valueOf()

    if ((await teamQuery.select()).length > 0) {
      await teamQuery.update(value.team)
    } else {
      await knex('teams').insert(value.team)
    }

    await followersQuery.delete()
    await knex('followers').insert(value.followers)
  }

  async delete () {
    await knex('teams').where({ team_idx: this.idx }).del()
  }

  verifyData () {
    let err = null
    if (!(this.followers instanceof Array)) err = TypeError(`Invalid type: followers should be Array but ${this.followers.constructor}.`)
    if (this.name.constructor !== String) err = new TypeError(`Invalid type: name should be String but ${this.name.constructor}.`)
    if (!this.leader) err = new Error('Invalid data: leader should be Object.')
    if (this.leader.name.constructor !== String) err = new TypeError(`Invalid type: leader.name should be String but ${this.leader.name.constructor}.`)
    if (isNaN(Number(this.leader.serial))) err = new TypeError(`Invalid type: leader.id should be Number but ${this.leader.id.constructor}.`)
    this.followers.forEach(v => {
      if (v.name && v.serial && v.priority) {
        if (v.name.constructor !== String) err = new TypeError('Invalid type: follower.name which is in followers should be string.')
        if (isNaN(Number(v.serial))) err = new TypeError('Invalid type: follower.id which is in followers should be number.')
        if (isNaN(Number(v.priority))) err = new TypeError('Invalid type: follower.priority which is in followers should be number.')
        if (v.priority < 1 || v.priority > 4) err = new Error('Invalid data : follower.id which is in followers should be bigger than 0 and smaller than 5.')
      } else {
        err = new Error('Not allowed null or undefined data.')
      }
    })
    if (err) throw err
  }

  static format (team) {
    return {
      idx: team.idx,
      name: team.name,
      leader: {
        serial: team.leader_serial,
        name: team.leader_name,
        contact: team.leader_contact
      },
      description: team.description,
      updatedAt: moment(team.updated_at).format('MM월 DD일 hh시 mm분')
    }
  }

  static formatFollowers (followers) {
    return followers.map(v => ({
      idx: v.idx,
      serial: v.serial,
      name: v.name,
      contact: v.contact
    }))
  }

  static findByTeamIdx (idx) {
    return Team.findOne({ idx })
  }

  static findByLeaderSerial (serial) {
    return Team.findOne({ leader_serial: serial })
  }

  static async findOne (query) {
    const team = (await knex('teams').where(query).select())[0]

    return team && new Team({
      ...Team.format(team),
      followers:
        Team.formatFollowers(await knex('followers')
          .where({ team_idx: team.idx }).select()),
      files: await File.findByTeamIdx(team.idx)
    })
  }

  /**
   * 모든 팀 정보를 가져온다.
   * TODO
   * @returns {Promise<Object, Error>}
   */
  static async getList () {
    const teams = await knex('teams').select()
    return Promise.all(teams.map(async team => new Team({
      ...Team.format(team),
      followers: Team.formatFollowers(
        await knex('followers')
          .where({ team_idx: team.idx })
          .select()
      ),
      files: (await knex('files')
        .where({ team_idx: team.idx })
        .select())
        .map(File.format)
    })))
  }
}

module.exports = Team
