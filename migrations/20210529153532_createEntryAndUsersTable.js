exports.up = function (knex) {
	return knex.schema
		.createTable('users', (table) => {
			table.increments()
			table.string('email')
			table.timestamps()
		})
		.createTable('entries', (table) => {
			table.increments()
			table.integer('energy_level')
			table.timestamp('timestamp')
			table.integer('user_id')

			table.foreign('user_id').references('id').inTable('users')
		})
}

exports.down = function (knex) {
	return knex.schema.dropTable('entries').dropTable('users')
}
