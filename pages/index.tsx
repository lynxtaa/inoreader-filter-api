import { ChakraProvider } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DehydratedState, Hydrate, dehydrate } from 'react-query/hydration'

import connectMongo from '../api/connectMongo'
import { RuleModel } from '../api/models/Rule'
import App from '../src/components/App'
import theme from '../src/theme'

const queryClient = new QueryClient()

type Props = {
	dehydratedState: DehydratedState
}

export default function Home({ dehydratedState }: Props) {
	return (
		<StrictMode>
			<ChakraProvider resetCSS theme={theme}>
				<QueryClientProvider client={queryClient}>
					<Hydrate state={dehydratedState}>
						<App />
					</Hydrate>
				</QueryClientProvider>
			</ChakraProvider>
		</StrictMode>
	)
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	await connectMongo()

	const queryClient = new QueryClient()

	const rules = await RuleModel.find().collation({ locale: 'en' }).sort('ruleDef.value')

	queryClient.setQueryData('filters', {
		data: rules.map(rule => rule.toJSON()),
	})

	return {
		props: { dehydratedState: dehydrate(queryClient) },
	}
}
