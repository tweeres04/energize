process.env.TZ = 'America/Vancouver'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import * as dateFns from 'date-fns'

import { ManagementClient } from 'auth0'

import mailgun_ from 'mailgun-js'

const mailgun = mailgun_({
	apiKey: process.env.MAILGUN_API_KEY || '',
	domain: process.env.MAILGUN_DOMAIN || '',
})

import getKnexInstance from '../../lib/getKnexInstance'

const url =
	process.env.NODE_ENV !== 'production'
		? `http://localhost:3000`
		: 'https://energize.tweeres.ca'

const knex = getKnexInstance()

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		try {
			await queuePromptsForDay()
			res.status(204).send(null)
		} catch (err) {
			console.error(err)
			res.status(500).send(err)
		}
	} else {
		res.status(405).send(null)
	}
}

async function queuePromptsForDay() {
	console.log('Job run at ', new Date().toLocaleString())

	const eachHour = dateFns.eachHourOfInterval({
		start: dateFns.set(new Date(), { hours: 6, minutes: 0, seconds: 0 }),
		end: dateFns.set(new Date(), { hours: 23, minutes: 0, seconds: 0 }),
	})

	// Supposed to be a 50% chance of no prompt in the day
	const promptTimes =
		_.random(0, 1) === 0 ? [] : new Set(_.sampleSize(eachHour, 1))

	const promises = Array.from(promptTimes).map(async (promptTime) => {
		const emails = await getUserEmails()
		console.log(
			`Will send prompt to ${emails.join(
				', '
			)} at ${promptTime.toLocaleString()}`
		)
		const promises = emails.map((email) =>
			mailgun
				.messages()
				.send({
					from: 'Energize <prompt@energize.tweeres.ca>',
					to: email,
					subject: "What's your energy level?",
					text: `What's your energy level? Log it here:\n\n${url}`,
					'o:deliverytime': (promptTime.getTime() / 1000).toString(),
				})
				.then((body) => {
					console.log(body)
					console.log(`Sent an entry prompt to ${email}`)
				})
		)

		await Promise.all(promises)
	})

	await Promise.all(promises)
}

async function getUserEmails() {
	const auth0 = new ManagementClient({
		domain: process.env.AUTH0_BASE_URL as string,
		clientId: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		scope: 'read:users',
	})

	const users = await auth0.getUsers()

	return users.map((user) => user.email as string)
}
