exports.up = async function (knex) {
	await knex.schema.createTable('users', (t) => {
		t.increments('id').primary()
		t.timestamp('created_at').notNullable()

		t.string('inoreader_user_id').notNullable().unique()
		t.string('inoreader_user_name').notNullable()
		t.string('inoreader_access_token').notNullable()
		t.string('inoreader_token_type').notNullable()
		t.string('inoreader_refresh_token').notNullable()
		t.timestamp('inoreader_access_token_expires_at').notNullable()
	})

	await knex.schema.createTable('rules', (t) => {
		t.increments('id').primary()
		t.timestamp('created_at').notNullable()
		t.boolean('is_active').defaultTo(true).notNullable()
		t.timestamp('last_hit_at')
		t.integer('hits').defaultTo(0).notNullable()
		t.jsonb('rule').notNullable()
		t.integer('user_id').notNullable()

		t.foreign('user_id').references('users.id').onDelete('CASCADE')
	})
}

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('rules')
	await knex.schema.dropTableIfExists('users')
}
