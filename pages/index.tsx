import { ThemeProvider, CSSReset, DarkMode } from '@chakra-ui/core'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import ms from 'ms'

import App from '../src/components/App'
import connectMongo from '../api/connectMongo'
import RuleModel from '../api/models/Rule'
import { RuleData } from '../api/types'
import theme from '../src/theme'

type Props = {
	initialData: { data: RuleData[] }
}

export default function Home({ initialData }: Props): JSX.Element {
	return (
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<DarkMode>
					<CSSReset />
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
					<App initialData={initialData} />
				</DarkMode>
			</ThemeProvider>
		</React.StrictMode>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	await connectMongo()

	const rules = await RuleModel.find().collation({ locale: 'en' }).sort('ruleDef.value')

	const initialData = {
		data: rules.map((rule) => ({
			_id: String(rule._id),
			createdAt: rule.createdAt.toISOString(),
			isActive: rule.isActive,
			lastHitAt: rule.lastHitAt ? rule.lastHitAt.toISOString() : null,
			hits: rule.hits,
			ruleDef: {
				prop: rule.ruleDef.prop,
				type: rule.ruleDef.type,
				negate: rule.ruleDef.negate,
				value: rule.ruleDef.value,
			},
		})),
	}

	return {
		props: { initialData },
		revalidate: ms('1h') / 1000,
	}
}
