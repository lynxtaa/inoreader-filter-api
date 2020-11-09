import { IconButton, useColorMode, IconButtonProps } from '@chakra-ui/core'

type Props = Omit<IconButtonProps, 'children' | 'aria-label'>

export default function ColorModeToggle(props: Props): JSX.Element {
	const { colorMode, toggleColorMode } = useColorMode()

	return (
		<IconButton
			onClick={toggleColorMode}
			{...props}
			aria-label="Toggle color mode"
			icon={colorMode === 'light' ? 'sun' : 'moon'}
		/>
	)
}
