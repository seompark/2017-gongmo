exports.up = async knex => {
  const follower = await knex.schema.alterTable('followers', table => {
    table.integer('priority').notNullable()
  })
  return [follower]
}

exports.down = async knex => {
  const follower = await knex.schema.alterTable('followers', table => {
    table.dropColumn('priority')
  })
  return [follower]
}
