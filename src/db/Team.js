const knex = require('./knex')

class Team {
  /**
   * @typedef {Object} Team
   * @property {Object} leader
   * @property {Array<Object>} followers
   * @property {string} description
   * @property {string} fileHash
   *
   * @param {Team} team
   */
  constructor ({
    leader,
    name = leader.name,
    followers = [],
    description = '',
    file = null
  }) {
    this.name = name
    this.leader = leader
    this.followers = followers
    this.description = description
    this.file = file
  }

  valueOf () {
    return {
      team: {
        name: this.name,
        leader_id: this.leader.id,
        leader_name: this.leader.name,
        description: this.description,
        original_file_name: this.file.originalName,
        file_hash: this.file.name
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
    console.log('called', await teamQuery.select())
    if ((await teamQuery.select()).length > 0) {
      console.log('called')
      await teamQuery.update(value.team)
      return
    }

    await knex('teams').insert(value.team)
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
    console.log(err)
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
    if (!tm) throw new Error('Team not found')
    return new Team({
      name: tm.name,
      leader: { id: tm.leader_id, name: tm.leader_name },
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
    const followers = await knex.select(
      'teams.name as team_name',
      'teams.leader_id',
      'teams.leader_name',
      'teams.description',
      'followers.name',
      'followers.id'
    )
    .from('teams')
    .innerJoin('followers', 'teams.leader_id', 'followers.leader_id')

    // TODO Refactoring
    const teams = {}
    followers.forEach(v => {
      let tm = teams[v.team_name]
      if (!tm) {
        tm = teams[v.team_name] = new Team({
          name: v.team_name,
          leader: {
            id: v.leader_id,
            name: v.leader_name
          },
          description: v.description,
          followers: []
        })
      }
      tm.followers.push({
        id: v.id,
        name: v.name,
        priority: v.priority
      })
    })
    return teams
  }
}

module.exports = Team
