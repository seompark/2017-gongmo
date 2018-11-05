exports.up = async knex => {
  const teams = await knex.schema.createTable('teams', table => {
    table.collate('utf8_unicode_ci')

    table.increments('idx').primary()
    table.integer('leader_id').notNullable()
    table.string('leader_name').notNullable()
    table.string('leader_contact').nullable()
    table.string('name').notNullable().unique()
    table.string('description').nullable()
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })

  const files = await knex.schema.createTable('files', table => {
    table.collate('utf8_unicode_ci')

    table.increments('idx').notNullable()
    table.string('hash').notNullable()
    table.string('original_name').notNullable()
    table.integer('leader_id').notNullable()
    table.string('type').notNullable()

    table.foreign('leader_id').references('teams.leader_id')
  })

  const followers = await knex.schema.createTable('followers', table => {
    table.collate('utf8_unicode_ci')

    table.integer('idx').increments().primary()
    table.integer('id').notNullable()
    table.string('name').notNullable()
    table.string('contact').defaultTo('')
    table.integer('leader_id').notNullable()
    table.integer('priority').notNullable()

    table.foreign('leader_id').references('teams.leader_id')
  })

  const notices = await knex.schema.createTable('notices', table => {
    table.collate('utf8_unicode_ci')

    table.increments('idx').primary()
    table.timestamps(true, true)
    table.string('message')
  })

  return [teams, files, followers, notices]
}

exports.down = async knex => {
  const teams = await knex.schema.dropTable('teams')
  const files = await knex.schema.dropTable('files')
  const followers = await knex.schema.dropTable('followers')
  return [teams, files, followers]
}
