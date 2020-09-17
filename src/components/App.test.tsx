import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { RuleData, ArticleProp, FilterType, AppStatus } from '../../api/types'
import renderWithProviders from '../test/renderWithProviders'
import { rest, server } from '../test/server'

import App from './App'

beforeEach(() => {
	let data: RuleData[] = [
		{
			_id: '1',
			createdAt: new Date('2020-01-30').toISOString(),
			lastHitAt: null,
			hits: 0,
			isActive: true,
			ruleDef: {
				prop: ArticleProp.Href,
				type: FilterType.Contains,
				negate: false,
				value: '/r/sport',
			},
		},
		{
			_id: '2',
			createdAt: new Date('2020-01-30').toISOString(),
			lastHitAt: new Date('2020-02-15').toISOString(),
			isActive: true,
			hits: 10,
			ruleDef: {
				prop: ArticleProp.Title,
				type: FilterType.Contains,
				negate: false,
				value: 'Trump',
			},
		},
	]

	server.use(
		rest.get('/api/status', (req, res, ctx) => {
			const data: AppStatus = {
				latestRunAt: new Date('2020-05-20').toISOString(),
				currentInterval: 15000,
			}
			return res(ctx.json(data))
		}),

		rest.get('/api/filters', (req, res, ctx) => res(ctx.json({ data }))),

		rest.post('/api/filters', (req, res, ctx) => {
			const { body } = req
			if (!body || typeof body !== 'object') {
				return res(ctx.status(400))
			}

			const newFilter: RuleData = {
				_id: String(Math.random()),
				createdAt: new Date().toISOString(),
				hits: 0,
				lastHitAt: null,
				isActive: body.isActive ?? true,
				ruleDef: body.ruleDef as RuleData['ruleDef'],
			}

			data = [...data, newFilter]

			return res(ctx.json({ data: newFilter }))
		}),

		rest.delete('/api/filters/:id', (req, res, ctx) => {
			data = data.filter((filter) => filter._id !== req.params.id)
			return res(ctx.json({ data: true }))
		}),
	)
})

it('shows list of rules', async () => {
	renderWithProviders(<App initialData={{ data: [] }} />)

	const firstItem = await screen.findByText('Trump')
	expect(firstItem).toHaveAttribute(
		'title',
		expect.stringMatching(/Last hit at: 15\.02\.2020/i),
	)

	const secondItem = await screen.findByText('/r/sport')
	expect(secondItem).not.toHaveAttribute('title')
})

it('shows status bar', async () => {
	renderWithProviders(<App initialData={{ data: [] }} />)

	expect(await screen.findByText(/Total Hits: 10/i)).toBeInTheDocument()
	expect(await screen.findByText(/Latest run: .* ago/i)).toBeInTheDocument()
})

it('adds new rule', async () => {
	renderWithProviders(<App initialData={{ data: [] }} />)

	expect(await screen.findByText('Trump')).toBeInTheDocument()

	userEvent.type(screen.getByRole('textbox', { name: 'Add hrefs...' }), '/r/overwatch')
	userEvent.click(screen.getByRole('button', { name: 'Add hrefs...' }))

	await screen.findByText('/r/overwatch')
})

it('removes existing rule', async () => {
	renderWithProviders(<App initialData={{ data: [] }} />)

	const listItem = await screen.findByText('Trump')

	expect(listItem).toBeInTheDocument()

	userEvent.click(screen.getByRole('button', { name: 'Delete Trump' }))

	const confirmButton = await screen.findByRole('button', { name: 'Yes' })

	userEvent.click(confirmButton)

	await waitForElementToBeRemoved(listItem)

	expect(confirmButton).not.toBeInTheDocument()
})
