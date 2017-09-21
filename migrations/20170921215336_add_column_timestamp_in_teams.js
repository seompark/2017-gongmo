exports.up = async knex => {
  const team = await knex.schema.alterTable('teams', table => {
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
  return [team]
}

exports.down = async knex => {
  const team = await knex.schema.alterTable('teams', table => {
    table.dropColumn('updated_at')
  })
  return [team]
}
