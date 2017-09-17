exports.up = async knex => {
  const follower = await knex.schema.table('followers', table => {
    table.renameColumn('leader', 'leader_id')
  })
  return [follower]
}

exports.down = async knex => {
  const follower = await knex.schema.table('followers', table => {
    table.renameColumn('leader_id', 'leader')
  })
  return [follower]
}
