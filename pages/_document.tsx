import { ColorModeScript } from '@chakra-ui/react'
import Document, { Html, Main, NextScript, Head } from 'next/document'
import React from 'react'

import theme from '../src/theme'

export default class MyDocument extends Document {
	render(): JSX.Element {
		return (
			<Html lang="en">
				<Head />
				<body>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
