exports.up = async knex => {
  const team = await knex.schema.alterTable('teams', table => {
    table.string('file_hash').nullable()
  })
  return [team]
}

exports.down = async knex => {
  const team = await knex.schema.alterTable('teams', table => {
    table.dropColumn('file_hash')
  })
  return [team]
}
