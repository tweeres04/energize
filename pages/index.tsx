import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import Nav from '../components/nav'

type FormData = {
	energyLevel: string
}

export default withPageAuthRequired(function Home() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, isSubmitSuccessful, isSubmitted },
	} = useForm()

	async function onSubmit(data: FormData) {
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
			<div className="container">
				<Nav />
				{isSubmitSuccessful && <h1>Entry submitted!</h1>}
				{!isSubmitted && (
					<>
						<h1>What&apos;s your energy level like?</h1>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="my-4 h1">
								{Array.from({ length: 5 }).map((_, n) => {
									n = n + 1
									return (
										<div className="form-check form-check-inline" key={n}>
											<input
												className="form-check-input"
												type="radio"
												{...register('energyLevel', {
													required: true,
												})}
												value={n}
												id={`energyLevel${n}`}
											/>
											<label
												className="form-check-label"
												htmlFor={`energyLevel${n}`}
											>
												{n}
											</label>
										</div>
									)
								})}
							</div>
							<div>
								<button
									className="btn btn-primary"
									type="submit"
									disabled={isSubmitting}
								>
									Submit
								</button>
							</div>
						</form>
					</>
				)}
			</div>
		</>
	)
})
