import Head from 'next/head'
import { useQuery } from 'react-query'
import { round, toNumber } from 'lodash'

import Spinner from '../components/spinner'

import {
	ResponsiveContainer,
	Tooltip,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Bar,
} from 'recharts'

type Response = {
	byDayOfWeek: DayOfWeekEntry[]
	byTimeOfDay: TimeOfDayEntry[]
}

type DayOfWeekEntry = {
	avg: string
	dow: number
}

type TimeOfDayEntry = {
	avg: string
	hour: number
}

const dayOfWeekMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function useEntries() {
	return useQuery<Response>(
		'chartData',
		function () {
			return fetch('/api/charts').then((response) => response.json())
		},
		{
			staleTime: 1000 * 60 * 30, // Should be 30 minutes
		}
	)
}

export default function Charts() {
	const query = useEntries()

	const dayOfWeekData = (query.data?.byDayOfWeek || []).map(({ dow, avg }) => ({
		dow: dayOfWeekMap[dow],
		avg: round(toNumber(avg), 2),
	}))

	const timeOfDayData = (query.data?.byTimeOfDay || []).map(
		({ hour, avg }) => ({
			hour: `${hour}:00`,
			avg: round(toNumber(avg), 2),
		})
	)

	return (
		<>
			<Head>
				<title>Energize</title>
				<meta name="description" content="An experiment with energy levels" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{query.isLoading ? (
				<Spinner />
			) : (
				<div className="container">
					<h1>Your energy levels</h1>
					<h3>By day of week</h3>
					<ResponsiveContainer width="100%" height={500}>
						<BarChart data={dayOfWeekData} width={1200} height={500}>
							<Tooltip />
							<Bar dataKey="avg" label={{ fill: 'white' }} />
							<XAxis dataKey="dow" />
							<YAxis />
							<CartesianGrid />
						</BarChart>
					</ResponsiveContainer>
					<h3>By time of day</h3>
					<ResponsiveContainer width="100%" height={500}>
						<BarChart data={timeOfDayData} width={1200} height={500}>
							<Tooltip />
							<Bar dataKey="avg" label={{ fill: 'white' }} />
							<XAxis dataKey="hour" />
							<YAxis />
							<CartesianGrid />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</>
	)
}
