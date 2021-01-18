import { SimpleGrid, Heading, Spinner, Flex } from '@chakra-ui/react'
import axios from 'axios'
import ms from 'ms'
import { useQuery } from 'react-query'

import { ArticleProp, RuleData } from '../../api/types'
import useErrorHandler from '../hooks/useErrorHandler'

import AppStatus from './AppStatus'
import ColorModeToggle from './ColorModeToggle'
import Editor from './Editor'

const titles: { [key in ArticleProp]: string } = {
	[ArticleProp.Href]: 'Hrefs',
	[ArticleProp.Title]: 'Titles',
}

export default function App(): JSX.Element {
	const errorHandler = useErrorHandler()

	const { data, error } = useQuery(
		'filters',
		() => axios.get<{ data: RuleData[] }>('/api/filters').then((res) => res.data),
		{
			staleTime: ms('10s'),
			onError: (error) => errorHandler('Unable load filters', error),
		},
	)

	let totalHits = 0
	if (data) {
		for (const filter of data.data) {
			totalHits += filter.hits
		}
	}

	return (
		<Flex
			maxWidth="2xl"
			minHeight="100vh"
			height="100%"
			margin="0 auto"
			px={4}
			paddingTop={4}
			direction="column"
		>
			{/* Disabling this feature for now because it's broken with next.js */}
			{false && <ColorModeToggle float="right" ml={2} />}
			<Heading fontWeight="light" fontSize="4rem" marginBottom={5}>
				Inoreader Filter
			</Heading>
			{data ? (
				<SimpleGrid columns={[1, 1, 2, 2]} spacing={10} mb={10}>
					{Object.values(ArticleProp).map((prop) => (
						<Editor
							key={prop}
							title={titles[prop]}
							rules={data.data.filter((el) => el.ruleDef.prop === prop)}
							prop={prop}
						/>
					))}
				</SimpleGrid>
			) : error ? null : (
				<Spinner size="xl" />
			)}
			<AppStatus totalHits={totalHits} mt="auto" />
		</Flex>
	)
}
