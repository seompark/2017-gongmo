exports.up = async knex => {
  const follower = await knex.schema.alterTable('followers', table => {
    table.dropPrimary('leader_id')
    table.primary('id')
  })
  return [follower]
}

exports.down = async knex => {
  const follower = await knex.schema.alterTable('followers', table => {
    table.dropPrimary('id')
    table.primary('leader_id')
  })
  return [follower]
}
