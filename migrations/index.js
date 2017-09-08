exports.up = async knex => {
  const follower = await knex.schema.createTable('followers', table => {
    table.integer('id').notNullable().primary()
    table.string('name').notNullable()
  })
  const team = await knex.schema.createTable('teams', table => {
    table.string('leader').notNullable().primary()
    table.string('form_path').nullable()
    table.string('service_domain').nullable()
  })
  return [follower, team]
}

exports.down = async knex => {
  const follower = await knex.schema.dropTable('followers')
  const team = await knex.schema.dropTable('teams')
  return [follower, team]
}
