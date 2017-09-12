exports.up = async knex => {
  const team = await knex.schema.createTable('teams', table => {
    table.string('leader').notNullable().primary()
    table.string('form_path').nullable()
    table.string('service_domain').nullable()
  })
  return [team]
}

exports.down = async knex => {
  const team = await knex.schema.dropTable('teams')
  return [team]
}
