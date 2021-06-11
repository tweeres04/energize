// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getKnexInstance from '../../lib/getKnexInstance'

const knex = getKnexInstance()

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { energyLevel } = JSON.parse(req.body)
		await knex('entries').insert({
			energy_level: energyLevel,
			timestamp: new Date(),
			user_id: 1,
		})
		res.status(204).send(null)
	} else if (req.method === 'GET') {
		const entries = await knex('entries').select('*').where({
			user_id: 1,
		})
		res.send(entries)
	}
}
