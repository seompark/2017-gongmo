exports.up = async knex => {
  const team = await knex.schema.table('teams', table => {
    table.dropColumn('leader')
    table.string('leader_name').notNullable()
    table.string('leader_id').notNullable().primary()
  })
  return [team]
}

exports.down = async knex => {
  const team = await knex.schema.table('teams', table => {
    table.dropColumn('leader_name')
    table.dropColumn('leader_id')
    table.string('leader').notNullable().primary()
  })
  return [team]
}
