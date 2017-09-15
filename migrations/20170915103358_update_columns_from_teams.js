exports.up = async knex => {
  const team = await knex.schema.table('teams', table => {
    table.dropColumn('form_path')
    table.dropColumn('service_domain')
    table.string('description').nullable()
  })
  return [team]
}

exports.down = async knex => {
  const team = await knex.schema.table('teams', table => {
    table.string('form_path').nullable()
    table.string('service_domain').nullable()
    table.dropColumn('description')
  })
  return [team]
}
