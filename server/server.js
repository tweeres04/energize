/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '.env.local' })

const { createServer } = require('http')
const next = require('next')
const { parse } = require('url')

const mailgun = require('mailgun-js')({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN,
})

const schedule = require('node-schedule')
const dateFns = require('date-fns')
const _ = require('lodash')

const getKnexInstance = require('./getKnexInstance')
const knex = getKnexInstance()

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = process.env.PORT ?? 3000
const url = dev ? `http://localhost:${port}` : 'https://energize.tweeres.ca'

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url, true)
		handle(req, res, parsedUrl)
	}).listen(port, (err) => {
		if (err) throw err
		console.log(`Ready on http://localhost:${port}`)
	})
})

schedule.scheduleJob({ hour: 0, minute: 0 }, setPromptsForDay)

function setPromptsForDay() {
	console.log('Job run at ', new Date().toLocaleString())

	const eachHour = dateFns.eachHourOfInterval({
		start: dateFns.set(new Date(), { hours: 6, minutes: 0, seconds: 0 }),
		end: dateFns.set(new Date(), { hours: 23, minutes: 0, seconds: 0 }),
	})

	const promptTimes = new Set(_.times(2, () => _.sample(eachHour)))

	promptTimes.forEach((pt) => {
		schedule.scheduleJob(pt, promptUsersForEntry)
	})
}

async function promptUsersForEntry() {
	const emails = await getUserEmails()
	emails.forEach((email) => {
		mailgun.messages().send(
			{
				from: 'Energize <prompt@energize.tweeres.ca>',
				to: email,
				subject: "What's your energy level?",
				text: `What's your energy level? Log it here:\n\n${url}`,
			},
			(error, body) => {
				console.log(body)
				console.log(`Sent an entry prompt to ${email}`)
			}
		)
	})
}

function getUserEmails() {
	return knex('users').select('email')
}

setPromptsForDay()
