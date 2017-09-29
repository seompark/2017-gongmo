exports.up = async knex => {
  const files = await knex.schema.createTable('files', table => {
    table.string('hash').notNullable().primary()
    table.string('original_name').notNullable()
    table.integer('leader_id').notNullable()
    table.string('type').notNullable()
    table.foreign('leader_id').references('teams.leader_id')
  })
  return [files]
}

exports.down = async knex => {
  const files = await knex.schema.dropTable('files')
  return [files]
}
