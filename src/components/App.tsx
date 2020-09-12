import { Box, SimpleGrid, Heading, Spinner } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import fetchApi from './utils/fetchApi'
import Editor from './Editor'
import { ArticleProp, RuleData } from '../types'
import useErrorHandler from '../hooks/useErrorHandler'

const titles: { [key in ArticleProp]: string } = {
	[ArticleProp.Href]: 'Hrefs',
	[ArticleProp.Title]: 'Titles',
}

export default function App(): JSX.Element {
	const errorHandler = useErrorHandler()

	const { data, error, mutate } = useSWR('/api/filters', (url) =>
		fetchApi<{ data: RuleData[] }>(url),
	)

	const errorMessage = error?.message

	useEffect(() => {
		if (errorMessage) {
			errorHandler('Unable load filters')(new Error(errorMessage))
		}
	}, [errorHandler, errorMessage])

	return (
		<Box
			className="App"
			maxWidth="2xl"
			minHeight="100vh"
			height="100%"
			margin="0 auto"
			padding={4}
		>
			<Heading fontWeight="light" fontSize="4rem" marginBottom={8}>
				Inoreader Filter
			</Heading>
			{data ? (
				<SimpleGrid columns={2} spacing={10}>
					{Object.values(ArticleProp).map((prop) => (
						<Editor
							key={prop}
							title={titles[prop]}
							rules={data.data.filter((el) => el.ruleDef.prop === prop)}
							refetch={mutate}
							prop={prop}
						/>
					))}
				</SimpleGrid>
			) : error ? null : (
				<Spinner size="xl" />
			)}
		</Box>
	)
}
