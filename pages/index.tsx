import { ThemeProvider, CSSReset, theme, DarkMode } from '@chakra-ui/core'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import ms from 'ms'

import App from '../src/components/App'
import connectMongo from '../api/connectMongo'
import RuleModel from '../api/models/Rule'
import { RuleData } from '../api/types'

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
		revalidate: ms('6h') / 1000,
	}
}
