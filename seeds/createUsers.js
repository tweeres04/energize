exports.seed = function (knex) {
	return knex('users')
		.del()
		.then(function () {
			return knex('users').insert([{ id: 1, email: 'tweeres04@gmail.com' }])
		})
}
