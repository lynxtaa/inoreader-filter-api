import { DefaultTheme, theme } from '@chakra-ui/core'

const customTheme: DefaultTheme = {
	...theme,
	colors: {
		...theme.colors,
	},
}

export default customTheme
