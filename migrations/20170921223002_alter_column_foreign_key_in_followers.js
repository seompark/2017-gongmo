exports.up = async knex => {
  const team = await knex.schema.alterTable('teams', table => {
    table.integer('leader_id').alter()
  })
  const follower = await knex.schema.alterTable('followers', table => {
    table.foreign('leader_id').references('teams.leader_id')
  })
  return [team, follower]
}

exports.down = async knex => {
  const team = await knex.schema.alterTable('teams', table => {
    table.string('leader_id').alter()
  })
  const follower = await knex.schema.alterTable('followers', table => {
    table.dropForeign('leader_id')
  })
  return [team, follower]
}
