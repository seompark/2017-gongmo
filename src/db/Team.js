const knex = require('./knex')
const team = knex('teams')
const follower = knex('followers')

/**
 * 팀장 학번으로 팀 정보를 가져온다.
 * @param {string} id
 * @returns {Promise}
 */
exports.findByLeaderId = async (id) => {

}

/**
 * @param {Object} followers
 * @returns {Promise}
 */
exports.updateFollower = async (followers) => {

}
