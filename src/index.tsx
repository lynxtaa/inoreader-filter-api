import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import theme from './theme'

import App from './components/App'

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CSSReset />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root'),
)
