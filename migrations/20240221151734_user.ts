import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex('warpcast_user').insert([
    {
      fid: 354669,
      username: 'dappykit',
      display_name: '🔴 DappyKit',
      profile_image: 'https://i.imgur.com/JsfH9F9.jpg',
      data: 'test',
      created_at: '2024-02-21 15:58:20',
      updated_at: '2024-02-21 16:59:19',
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex('warpcast_user').where('fid', 354669).delete()
}
