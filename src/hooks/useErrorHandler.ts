import { useToast } from '@chakra-ui/core'
import { useCallback } from 'react'

export default function useErrorHandler(): (message?: string) => (error: Error) => void {
	const toast = useToast()

	const errorHandler = useCallback(
		(message?: string) => (error: Error) => {
			// eslint-disable-next-line no-console
			console.error(error)

			toast({
				title: message || error.message,
				description: error.message,
				status: 'error',
				isClosable: true,
				duration: null,
			})
		},
		[toast],
	)

	return errorHandler
}
