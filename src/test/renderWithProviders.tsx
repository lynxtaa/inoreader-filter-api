import { ChakraProvider } from '@chakra-ui/react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { StrictMode } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'

import theme from '../theme'

export default function renderWithProviders(
	ui: React.ReactElement,
	options?: Omit<RenderOptions, 'queries'>,
): RenderResult {
	return render(
		<StrictMode>
			<ChakraProvider theme={theme} resetCSS>
				<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
			</ChakraProvider>
		</StrictMode>,
		options,
	)
}
