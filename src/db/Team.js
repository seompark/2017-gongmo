const knex = require('./knex')
const team = knex('teams')
const follower = knex('followers')

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
    fileHash
  }) {
    this.name = name
    this.leader = leader
    this.followers = followers
    this.description = description
    this.fileHash = fileHash
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
        .map(v => ({ leader_id: this.leader.id, id: v.id, name: v.name }))
    }
  }

  /**
   * DB에 저장
   * @returns {Promise}
   */
  async save () {
    const teamQuery = team.where({ leader_id: this.leader.id })
    const followersQuery = follower.where({ leader_id: this.leader.id })
    const value = this.valueOf()

    await followersQuery.delete()

    if (await teamQuery.select().length > 0) {
      await teamQuery.update(value.team)
      return
    }

    await team.insert(value.team)
    await follower.insert(value.followers)
  };;

  /**
   * 팀장 학번으로 팀 정보를 가져온다.
   * @param {number} id
   * @returns {Promise.<Team>}
   */
  static async findByLeaderId (id) {
    const followers = await follower.where({ leader_id: id }).select()
    const tm = await team.where({ leader_id: id }).select()[0]
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
    const followers = await team.select(
      'teams.name as team_name',
      'teams.leader_id',
      'teams.leader_name',
      'teams.description',
      'followers.name',
      'followers.id'
    )
    .innerJoin('followers', 'teams.leader_id', 'followers.leader_id')

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
        name: v.name
      })
    })
    return teams
  }
}

module.exports = Team
