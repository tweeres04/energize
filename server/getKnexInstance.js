const _knex = require('knex')

const config = {
	client: 'pg',
	connection: {
		host: process.env.HEROKU_DB_HOST,
		database: process.env.HEROKU_DB_NAME,
		user: process.env.HEROKU_DB_USER,
		password: process.env.HEROKU_DB_PASSWORD,
		ssl: { rejectUnauthorized: false },
	},
}

const knex = _knex(config)

function getKnexInstance() {
	return knex
}

getKnexInstance.config = config

module.exports = getKnexInstance
