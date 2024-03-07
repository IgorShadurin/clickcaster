import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create warpcast_user table
  await knex.schema.createTable('warpcast_user', table => {
    table.bigInteger('fid').unsigned().primary().unique().notNullable()
    table.string('username', 255).notNullable()
    table.string('display_name', 255).notNullable()
    table.string('profile_image', 255).notNullable()
    table.text('data', 'longtext').notNullable()

    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()
  })

  // Create friends_visits table
  await knex.schema.createTable('friends_visits', table => {
    table.bigIncrements('id').unsigned().primary()
    table
      .bigInteger('page_owner_id')
      .unsigned()
      .notNullable()
      .references('fid')
      .inTable('warpcast_user')
      .onDelete('CASCADE')
    table
      .bigInteger('visitor_id')
      .unsigned()
      .notNullable()
      .references('fid')
      .inTable('warpcast_user')
      .onDelete('CASCADE')

    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()

    table.unique(['page_owner_id', 'visitor_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  // Drop friends_visits table first due to foreign key dependency
  await knex.schema.dropTableIfExists('friends_visits')

  // Drop warpcast_user table
  await knex.schema.dropTableIfExists('warpcast_user')
}
