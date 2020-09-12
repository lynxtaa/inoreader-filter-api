import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import theme from './theme'

import App from './components/App'

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<ColorModeProvider>
				<CSSReset />
				<App />
			</ColorModeProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root'),
)
