exports.up = async knex => {
  const teams = await knex.schema.createTable('teams', table => {
    table.collate('utf8_unicode_ci')

    table.increments('idx').primary()
    table.string('leader_serial').notNullable()
    table.string('leader_name').notNullable()
    table.string('leader_contact').nullable()
    table.string('name').notNullable().unique()
    table.string('description').nullable()
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })

  const files = await knex.schema.createTable('files', table => {
    table.collate('utf8_unicode_ci')

    table.increments('idx').primary()
    table.string('hash').notNullable()
    table.string('original_name').notNullable()
    table.integer('team_idx')
      .notNullable()
      .unsigned()
      .references('idx')
      .inTable('teams')
      .onDelete('CASCADE')
    table.string('type').notNullable()
  })

  const followers = await knex.schema.createTable('followers', table => {
    table.collate('utf8_unicode_ci')

    table.increments('idx').primary()
    table.string('serial').notNullable()
    table.string('name').notNullable()
    table.string('contact').defaultTo('')
    table.integer('team_idx')
      .notNullable()
      .unsigned()
      .references('idx')
      .inTable('teams')
      .onDelete('CASCADE')
    table.integer('priority').notNullable()
  })

  return [teams, files, followers]
}

exports.down = async knex => {
  const teams = await knex.schema.dropTable('teams')
  const files = await knex.schema.dropTable('files')
  const followers = await knex.schema.dropTable('followers')
  return [teams, files, followers]
}
