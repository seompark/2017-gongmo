exports.up = async knex => {
  const team = await knex.schema.table('teams', table => {
    table.string('name').notNullable()
  })
  return [team]
}

exports.down = async knex => {
  const team = await knex.schema.table('teams', table => {
    table.dropColumn('name')
  })
  return [team]
}
