import Head from 'next/head'
import { useQuery } from 'react-query'

import Spinner from '../components/spinner'

function useEntries() {
	return useQuery<Entry[]>(
		'entries',
		function () {
			return fetch('/api/entries').then((response) => response.json())
		},
		{
			staleTime: 1000 * 60 * 5, // Should be 5 mins
		}
	)
}

type Entry = {
	energy_level: number
	timestamp: Date
}

export default function Report() {
	const { data: entries, isLoading } = useEntries()
	return (
		<>
			<Head>
				<title>Energize</title>
				<meta name="description" content="An experiment with energy levels" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="container">
				<h1>Your data</h1>
				{isLoading ? (
					<Spinner />
				) : entries.length > 0 ? (
					<table className="table">
						<thead>
							<tr>
								<th>timestamp</th>
								<th>energy level</th>
							</tr>
						</thead>
						<tbody>
							{entries.map(({ timestamp, energy_level }) => (
								<tr key={timestamp}>
									<td>{new Date(timestamp).toLocaleString()}</td>
									<td>{energy_level}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>No data yet</p>
				)}
			</div>
		</>
	)
}
