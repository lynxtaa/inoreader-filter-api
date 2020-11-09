import { Box, BoxProps, Text } from '@chakra-ui/core'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { AppStatus as AppStatusType } from '../../api/types'
import useFetch from '../hooks/useFetch'

type Props = {
	totalHits: number
} & BoxProps

const getDistance = (date: string) =>
	formatDistanceToNow(parseISO(date), { addSuffix: true })

export default function AppStatus({ totalHits, ...rest }: Props): JSX.Element {
	const { data, error } = useFetch<AppStatusType>('/api/status')

	return (
		<Box py={3} px={2} borderTop="1px" borderColor="gray.600" {...rest}>
			<Text as="span" mr={2}>
				Total Hits: {totalHits}
			</Text>
			•
			<Text as="span" ml={2}>
				{error
					? `Error fetching status: ${error.message}`
					: `Latest run: ${
							data
								? data.latestRunAt
									? getDistance(data.latestRunAt)
									: 'unknown'
								: '...'
					  }`}
			</Text>
		</Box>
	)
}
