require('dotenv').config({ path: '.env.local' })

const config = {
	host: process.env.HEROKU_DB_HOST,
	database: process.env.HEROKU_DB_NAME,
	user: process.env.HEROKU_DB_USER,
	password: process.env.HEROKU_DB_PASSWORD,
	ssl: { rejectUnauthorized: false },
}

module.exports = {
	development: {
		client: 'postgresql',
		connection: config,
	},
	production: {
		client: 'postgresql',
		connection: config,
	},
}
