import { PlusSquareIcon } from '@chakra-ui/icons'
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
} from '@chakra-ui/react'
import axios from 'axios'
import { format as formatDate, parseISO } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

import { RuleData, ArticleProp, FilterType } from '../../api/types'
import useErrorHandler from '../hooks/useErrorHandler'

import ConfirmModal from './ConfirmModal'

type FormValues = {
	text: string
}

type Props = {
	title: string
	rules: RuleData[]
	prop: ArticleProp
}

export default function Editor({ title, rules, prop }: Props): JSX.Element {
	const [ruleToDelete, setRuleToDelete] = useState<RuleData | null>(null)

	const queryClient = useQueryClient()

	const errorHandler = useErrorHandler()

	const { register, handleSubmit, errors, formState, reset } = useForm<FormValues>({
		defaultValues: { text: '' },
		mode: 'onSubmit',
	})

	const { isSubmitting } = formState

	const deleteMutation = useMutation(
		(ruleId: string) => axios.delete(`/api/filters/${ruleId}`),
		{
			onError(error) {
				errorHandler('Unable to delete filter', error)
			},
			onSuccess() {
				setRuleToDelete(null)
				queryClient.invalidateQueries('filters')
			},
		},
	)

	const submitMutation = useMutation(
		({ text }: FormValues) =>
			axios.post('/api/filters', {
				ruleDef: { value: text, prop, type: FilterType.Contains },
			}),
		{
			onError(error) {
				errorHandler('Unable to add filter', error)
			},
			onSuccess() {
				reset()
			},
			onSettled() {
				queryClient.invalidateQueries('filters')
			},
		},
	)

	return (
		<Box>
			<Heading size="xl" fontWeight="light" marginBottom={4}>
				{title}
			</Heading>
			{ruleToDelete && (
				<ConfirmModal
					message={`Delete selected rule «${ruleToDelete.ruleDef.value}» ?`}
					onCancel={() => setRuleToDelete(null)}
					onConfirm={() => deleteMutation.mutate(ruleToDelete._id)}
				/>
			)}
			<Box
				as="form"
				mb={4}
				onSubmit={handleSubmit(({ text }) => submitMutation.mutateAsync({ text }))}
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
								icon={<PlusSquareIcon />}
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
							colorScheme="red"
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
