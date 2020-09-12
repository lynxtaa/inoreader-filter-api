import {
	Box,
	Heading,
	List,
	ListItem,
	FormControl,
	Input,
	Button,
	Text,
	FormErrorMessage,
	IconButton,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/core'
import React, { useState } from 'react'
import { format as formatDate, parseISO } from 'date-fns'
import fetchApi from './utils/fetchApi'
import { useForm } from 'react-hook-form'
import { ArticleProp, FilterType, RuleData } from '../types'
import ConfirmModal from './ConfirmModal'
import useErrorHandler from '../hooks/useErrorHandler'

type FormValues = {
	text: string
}

type Props = {
	title: string
	rules: RuleData[]
	refetch: () => void
	prop: ArticleProp
}

export default function Editor({ title, rules, refetch, prop }: Props): JSX.Element {
	const [idToDelete, setIdToDelete] = useState<string | null>(null)

	const errorHandler = useErrorHandler()

	const { register, handleSubmit, errors, formState, reset } = useForm<FormValues>({
		defaultValues: { text: '' },
		mode: 'onSubmit',
	})

	const { isSubmitting } = formState

	function handleDelete(ruleId: string) {
		fetchApi(`/api/filters/${ruleId}`, { method: 'DELETE' })
			.catch(errorHandler('Unable to delete filter'))
			.finally(() => {
				setIdToDelete(null)
				refetch()
			})
	}

	return (
		<Box>
			<Heading size="xl" fontWeight="light" marginBottom={4}>
				{title}
			</Heading>
			{idToDelete !== null && (
				<ConfirmModal
					message="Delete selected rule?"
					onCancel={() => setIdToDelete(null)}
					onConfirm={() => handleDelete(idToDelete)}
				/>
			)}
			<Box
				as="form"
				mb={4}
				onSubmit={handleSubmit(({ text }) =>
					fetchApi('/api/filters', {
						method: 'POST',
						body: { ruleDef: { value: text, prop, type: FilterType.Contains } },
					})
						.then(() => reset())
						.catch(errorHandler('Unable to add filter'))
						.finally(refetch),
				)}
			>
				<FormControl isInvalid={Boolean(errors.text)}>
					<InputGroup>
						<Input
							type="text"
							name="text"
							aria-label={`Add ${title.toLowerCase()}...`}
							placeholder="Add..."
							ref={register({ required: 'required field' })}
							pr="3rem"
						/>
						<InputRightElement width="3rem">
							<IconButton
								type="submit"
								icon="plus-square"
								aria-label={`Add ${title.toLowerCase()}...`}
								isLoading={isSubmitting}
								isDisabled={isSubmitting}
								variant="ghost"
								title="Add"
							/>
						</InputRightElement>
					</InputGroup>
					<FormErrorMessage>{errors.text?.message}</FormErrorMessage>
				</FormControl>
			</Box>
			<List styleType="disc">
				{rules.map((el, i) => (
					<ListItem key={el._id} marginTop={i === 0 ? 0 : 4} fontSize="lg">
						<Text
							as="span"
							title={
								el.lastHitAt
									? `Last hit at: ${formatDate(
											parseISO(el.lastHitAt),
											'dd.MM.yyyy HH:mm',
									  )}`
									: undefined
							}
						>
							{el.ruleDef.value}
						</Text>
						<Text as="sup" color="gray.500">
							{' '}
							{el.hits}
						</Text>
						<Button
							aria-label={`Delete ${el.ruleDef.value}`}
							title="Delete"
							variant="outline"
							variantColor="red"
							size="xs"
							float="right"
							ml={3}
							onClick={() => setIdToDelete(el._id)}
						>
							×
						</Button>
					</ListItem>
				))}
			</List>
		</Box>
	)
}
