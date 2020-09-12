import { Box, SimpleGrid, Heading, Spinner } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import fetchApi from './utils/fetchApi'
import Editor from './Editor'
import { ArticleProp, RuleData } from '../types'
import useErrorHandler from '../hooks/useErrorHandler'
import ColorModeToggle from './ColorModeToggle'

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
		<Box maxWidth="2xl" minHeight="100vh" height="100%" margin="0 auto" padding={4}>
			<ColorModeToggle float="right" ml={2} />
			<Heading fontWeight="light" fontSize="4rem" marginBottom={8}>
				Inoreader Filter
			</Heading>
			{data ? (
				<SimpleGrid columns={[1, 1, 2, 2]} spacing={10}>
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
