import _knex from 'knex'

const knex = _knex({
	client: 'pg',
	connection: {
		host: process.env.HEROKU_DB_HOST,
		database: process.env.HEROKU_DB_NAME,
		user: process.env.HEROKU_DB_USER,
		password: process.env.HEROKU_DB_PASSWORD,
		ssl: { rejectUnauthorized: false },
	},
})

export default function getKnexInstance() {
	return knex
}
