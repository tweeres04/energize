const config = require('./getKnexInstance').config

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
