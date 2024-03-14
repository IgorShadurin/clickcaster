import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('warpcast_user', table => {
    table.boolean('is_clickcaster').defaultTo(false).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('warpcast_user', table => {
    table.dropColumn('is_clickcaster')
  })
}
