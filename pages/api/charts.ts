import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import getKnexInstance from '../../lib/getKnexInstance'

const knex = getKnexInstance()

export default withApiAuthRequired(async function charts(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const session = getSession(req, res)
		const byDayOfWeekPromise = knex('entries')
			.select(
				knex.raw(
					"extract(dow from timestamp at time zone 'America/Vancouver') dow"
				)
			)
			.avg('energy_level')
			.where({
				user_id: session.user.sub,
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
				user_id: session.user.sub,
			})
			.groupBy('hour')

		const [byDayOfWeek, byTimeOfDay] = await Promise.all([
			byDayOfWeekPromise,
			byTimeOfDayPromise,
		])

		res.send({ byDayOfWeek, byTimeOfDay })
	}
})
