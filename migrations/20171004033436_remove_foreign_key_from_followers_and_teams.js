exports.up = async knex => {
  const files = await knex.schema.alterTable('files', table => {
    table.dropForeign('leader_id')
  })
  const followers = await knex.schema.alterTable('followers', table => {
    table.dropForeign('leader_id')
  })
  return [files, followers]
}

exports.down = async knex => {

}
