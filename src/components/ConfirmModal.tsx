import React from 'react'
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@chakra-ui/core'

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
			<ModalContent>
				<ModalHeader>{message}</ModalHeader>
				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onCancel}>
						No
					</Button>
					<Button variantColor="blue" onClick={onConfirm}>
						Yes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
