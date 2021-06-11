// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import * as dateFns from 'date-fns'

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
		queuePromptsForDay()
		res.status(204).send(null)
	} else {
		res.status(405).send(null)
	}
}

function queuePromptsForDay() {
	console.log('Job run at ', new Date().toLocaleString())

	const eachHour = dateFns.eachHourOfInterval({
		start: dateFns.set(new Date(), { hours: 6, minutes: 0, seconds: 0 }),
		end: dateFns.set(new Date(), { hours: 23, minutes: 0, seconds: 0 }),
	})

	const promptTimes = new Set(_.sampleSize(eachHour, 2))

	promptTimes.forEach(async (promptTime) => {
		const emails = await getUserEmails()
		console.log(
			`Will send prompt to ${emails.join(
				', '
			)} at ${promptTime.toLocaleString()}`
		)
		emails.forEach((email) => {
			mailgun.messages().send(
				{
					from: 'Energize <prompt@energize.tweeres.ca>',
					to: email,
					subject: "What's your energy level?",
					text: `What's your energy level? Log it here:\n\n${url}`,
					'o:deliverytime': (promptTime.getTime() / 1000).toString(),
				},
				(error, body) => {
					console.log(body)
					console.log(`Sent an entry prompt to ${email}`)
				}
			)
		})
	})
}

async function getUserEmails() {
	return (await knex('users').select('email')).map(({ email }) => email)
}
