import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query'
import { UserProvider } from '@auth0/nextjs-auth0'

const queryClient = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<QueryClientProvider client={queryClient}>
				<Head>
					<link
						href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css"
						rel="stylesheet"
						integrity="sha384-uWxY/CJNBR+1zjPWmfnSnVxwRheevXITnMqoEIeG1LJrdI0GlVs/9cVSyPYXdcSF"
						crossOrigin="anonymous"
					></link>
				</Head>
				<Component {...pageProps} />
			</QueryClientProvider>
		</UserProvider>
	)
}
export default MyApp
