import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import getKnexInstance from '../../lib/getKnexInstance'

const knex = getKnexInstance()

export default withApiAuthRequired(async function (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = getSession(req, res)

	if (req.method === 'POST') {
		const { energyLevel } = JSON.parse(req.body)
		await knex('entries').insert({
			energy_level: energyLevel,
			timestamp: new Date(),
			user_id: session.user.sub,
		})
		res.status(204).send(null)
	} else if (req.method === 'GET') {
		const entries = await knex('entries')
			.select('*')
			.where({
				user_id: session.user.sub,
			})
			.orderBy('timestamp', 'desc')
		res.send(entries)
	}
})
