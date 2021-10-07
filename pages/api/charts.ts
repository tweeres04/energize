// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getKnexInstance from '../../lib/getKnexInstance'

const knex = getKnexInstance()

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const byDayOfWeekPromise = knex('entries')
			.select(
				knex.raw(
					"extract(dow from timestamp at time zone 'America/Vancouver') dow"
				)
			)
			.avg('energy_level')
			.where({
				user_id: 1,
			})
			.groupBy('dow')

		const byTimeOfDayPromise = knex('entries')
			.select(
				knex.raw(
					"extract(hour from timestamp at time zone 'America/Vancouver') as hour"
				)
			)
			.avg('energy_level')
			.where({
				user_id: 1,
			})
			.groupBy('hour')

		const [byDayOfWeek, byTimeOfDay] = await Promise.all([
			byDayOfWeekPromise,
			byTimeOfDayPromise,
		])

		res.send({ byDayOfWeek, byTimeOfDay })
	}
}
