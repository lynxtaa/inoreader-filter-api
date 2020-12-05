import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@chakra-ui/react'
import React from 'react'

type Props = {
	message: string
	onCancel: () => void
	onConfirm: () => void
}

export default function ConfirmModal({
	message,
	onCancel,
	onConfirm,
}: Props): JSX.Element {
	return (
		<Modal isOpen onClose={onCancel}>
			<ModalOverlay />
			<ModalContent borderRadius="0.4rem">
				<ModalHeader>{message}</ModalHeader>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={onConfirm}>
						Yes
					</Button>
					<Button onClick={onCancel}>No</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
