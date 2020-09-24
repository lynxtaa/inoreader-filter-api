import {
	Box,
	Heading,
	List,
	ListIcon,
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
import ConfirmModal from './ConfirmModal'
import useErrorHandler from '../hooks/useErrorHandler'
import { RuleData, ArticleProp, FilterType } from '../../api/types'

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
	const [ruleToDelete, setRuleToDelete] = useState<RuleData | null>(null)

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
				setRuleToDelete(null)
				refetch()
			})
	}

	return (
		<Box>
			<Heading size="xl" fontWeight="light" marginBottom={4}>
				{title}
			</Heading>
			{ruleToDelete && (
				<ConfirmModal
					message={`Delete selected rule «${ruleToDelete.ruleDef.value}» ?`}
					onCancel={() => setRuleToDelete(null)}
					onConfirm={() => handleDelete(ruleToDelete._id)}
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
							ref={register({
								required: 'required field',
								maxLength: {
									value: 128,
									message: 'value length should be less than 128 characters',
								},
								minLength: {
									value: 2,
									message: 'value length should be more than 1 character',
								},
							})}
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
			<List spacing={4}>
				{rules.map((el, i) => (
					<ListItem key={el._id} fontSize="lg" display="flex" alignItems="center">
						<Button
							aria-label={`Delete ${el.ruleDef.value}`}
							title="Delete"
							variant="outline"
							variantColor="red"
							size="xs"
							mr={4}
							onClick={() => setRuleToDelete(el)}
						>
							×
						</Button>
						<Text
							as="span"
							opacity={el.hits > 0 ? 1 : 0.6}
							mr={1}
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
							{el.hits}
						</Text>
					</ListItem>
				))}
			</List>
		</Box>
	)
}
