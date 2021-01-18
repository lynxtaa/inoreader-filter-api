import { ChakraProvider } from '@chakra-ui/react'
import ms from 'ms'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DehydratedState, Hydrate, dehydrate } from 'react-query/hydration'

import connectMongo from '../api/connectMongo'
import { RuleModel } from '../api/models/Rule'
import { RuleData } from '../api/types'
import App from '../src/components/App'
import theme from '../src/theme'

const queryClient = new QueryClient()

type Props = {
	dehydratedState: DehydratedState
}

export default function Home({ dehydratedState }: Props): JSX.Element {
	return (
		<StrictMode>
			<ChakraProvider resetCSS theme={theme}>
				<QueryClientProvider client={queryClient}>
					<Hydrate state={dehydratedState}>
						<Head>
							<title>Inoreader Filter</title>
							<meta charSet="utf-8" />
							<meta name="viewport" content="width=device-width, initial-scale=1" />
							<meta name="description" content="Inoreader Filter" />

							<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
							<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
							<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
							<link rel="manifest" href="/site.webmanifest" />
							<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
							<meta name="theme-color" content="#ffffff" />
						</Head>
						<App />
					</Hydrate>
				</QueryClientProvider>
			</ChakraProvider>
		</StrictMode>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	await connectMongo()

	const queryClient = new QueryClient()

	const rules = await RuleModel.find().collation({ locale: 'en' }).sort('ruleDef.value')

	queryClient.setQueryData('filters', {
		data: rules.map((rule) => rule.toJSON() as RuleData),
	})

	return {
		props: { dehydratedState: dehydrate(queryClient) },
		revalidate: ms('1h') / 1000,
	}
}
