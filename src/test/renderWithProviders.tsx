import { CSSReset, ThemeProvider, ColorModeProvider } from '@chakra-ui/core'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import React from 'react'

import theme from '../theme'

export default function renderWithProviders(
	ui: React.ReactElement,
	options?: Omit<RenderOptions, 'queries'>,
): RenderResult {
	return render(
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<CSSReset />
				<ColorModeProvider>{ui}</ColorModeProvider>
			</ThemeProvider>
		</React.StrictMode>,
		options,
	)
}
