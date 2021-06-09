import Head from 'next/head'
import { useForm } from 'react-hook-form'

export default function Home() {
	const { register, handleSubmit, formState } = useForm()

	async function onSubmit(data) {
		await fetch('/api/entries', {
			method: 'POST',
			body: JSON.stringify(data),
		})

		console.log('submitted', data)
	}

	return (
		<>
			<Head>
				<title>Energize</title>
				<meta name="description" content="An experiment with energy levels" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<style>{`
				.control {
					display: flex;
					justify-content: space-around;
					margin-bottom: 2rem;
				}

				.control > label {
					padding: 1rem;
				}
			`}</style>
			<h1>What's your energy level like?</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="control">
					<label>
						1
						<input
							type="radio"
							{...register('energyLevel', {
								required: true,
							})}
							value="1"
						/>
					</label>
					<label>
						2
						<input
							type="radio"
							{...register('energyLevel', {
								required: true,
							})}
							value="2"
						/>
					</label>
					<label>
						3
						<input
							type="radio"
							{...register('energyLevel', {
								required: true,
							})}
							value="3"
						/>
					</label>
					<label>
						4
						<input
							type="radio"
							{...register('energyLevel', {
								required: true,
							})}
							value="4"
						/>
					</label>
					<label>
						5
						<input
							type="radio"
							{...register('energyLevel', {
								required: true,
							})}
							value="5"
						/>
					</label>
				</div>
				<button type="submit">Submit</button>
			</form>
		</>
	)
}
