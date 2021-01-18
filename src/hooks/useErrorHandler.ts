import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'

export default function useErrorHandler(): (message: string, error: unknown) => void {
	const toast = useToast()

	const errorHandler = useCallback(
		(message: string, error: unknown) => {
			// eslint-disable-next-line no-console
			console.error(error)

			const errorMessage = error instanceof Error ? error.message : '-'

			toast({
				title: message,
				description: errorMessage,
				status: 'error',
				isClosable: true,
				duration: null,
			})
		},
		[toast],
	)

	return errorHandler
}
