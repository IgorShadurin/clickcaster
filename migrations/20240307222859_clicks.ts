import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Frames table
  await knex.schema.createTable('clicks_frame', table => {
    table.bigIncrements('id').unsigned().primary()
    table.string('title', 255).notNullable()
    table.string('description', 1024).defaultTo('')
    // the url is unique for click detection. 768 max length for uniq url
    table.string('url', 768).notNullable().unique().index()
    table.text('data', 'longtext').defaultTo('')
    table.string('verify_tag', 255).nullable()

    table.text('promo_data', 'longtext').defaultTo('')
    table.boolean('promo_approved').defaultTo(false)

    table
      .bigInteger('frame_owner_id')
      .unsigned()
      .notNullable()
      .references('fid')
      .inTable('warpcast_user')
      .onDelete('CASCADE')

    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()
  })

  // Visitors stata for any registered Frame
  await knex.schema.createTable('clicks_frame_visitors', table => {
    table.date('stata_date').notNullable().index()
    table.bigInteger('all_visitors').defaultTo(0)
    table.bigInteger('unique_visitors').defaultTo(0)

    table
      .bigInteger('frame_id')
      .index()
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('clicks_frame')
      .onDelete('CASCADE')

    table.index(['stata_date', 'frame_id'])
    table.unique(['stata_date', 'frame_id'])
  })

  // Clicks contribution to/from the service
  await knex.schema.createTable('clicks_contribution', table => {
    table.bigInteger('balance').defaultTo(0)
    table
      .bigInteger('frame_id')
      .index()
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('clicks_frame')
      .onDelete('CASCADE')
  })

  // Access keys for the service
  await knex.schema.createTable('clicks_access_key', table => {
    table.bigIncrements('id').unsigned().primary()
    table.string('eth_address', 40).notNullable().unique().index()
    table.boolean('active').defaultTo(false)
    table.bigInteger('user_id').unsigned().notNullable().references('fid').inTable('warpcast_user').onDelete('CASCADE')
    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('clicks_access_key')
  await knex.schema.dropTableIfExists('clicks_contribution')
  await knex.schema.dropTableIfExists('clicks_frame_visitors')
  await knex.schema.dropTableIfExists('clicks_frame')
}
