exports.up = async knex => {
  const follower = await knex.schema.createTable('followers', table => {
    table.integer('leader').notNullable().primary()
    table.integer('id').notNullable()
    table.string('name').notNullable()
  })
  return [follower]
}

exports.down = async knex => {
  const follower = await knex.schema.dropTable('followers')
  return [follower]
}
