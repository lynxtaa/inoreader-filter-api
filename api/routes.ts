import { FastifyPluginCallback } from 'fastify'
import inofilter from './lib/inofilter'

import RuleModel from './models/Rule'
import { AppStatus, ArticleProp, FilterType } from './types'

const addRoutes: FastifyPluginCallback = (app, options, next) => {
	app.get(
		'/status',
		async (): Promise<AppStatus> => {
			const { latestRunAt, currentInterval } = inofilter.getStatus()

			return {
				latestRunAt: latestRunAt ? latestRunAt.toISOString() : null,
				currentInterval,
			}
		},
	)

	app.get('/filters', async () => {
		const rules = await RuleModel.find().collation({ locale: 'en' }).sort('ruleDef.value')
		return { data: rules }
	})

	app.post<{
		Body: {
			isActive?: boolean
			ruleDef: {
				prop: ArticleProp
				type: FilterType
				negate: boolean
				value: string
			}
		}
	}>(
		'/filters',
		{
			schema: {
				body: {
					type: 'object',
					required: ['ruleDef'],
					properties: {
						isActive: { type: 'boolean' },
						ruleDef: {
							type: 'object',
							required: ['prop', 'type', 'value'],
							properties: {
								prop: { type: 'string', enum: Object.values(ArticleProp) },
								type: { type: 'string', enum: Object.values(FilterType) },
								negate: { type: 'boolean' },
								value: { type: 'string' },
							},
						},
					},
				},
			},
		},
		async (req) => {
			const { isActive, ruleDef } = req.body
			const newRule = await RuleModel.create({
				isActive: isActive ?? true,
				ruleDef,
				createdAt: new Date(),
				hits: 0,
				lastHitAt: null,
			})

			return { data: newRule }
		},
	)

	app.get<{ Params: { id: string } }>('/filters/:id', async (req) => {
		const { id } = req.params
		const rule = await RuleModel.findById(id)
		return { data: rule }
	})

	app.delete<{ Params: { id: string } }>('/filters/:id', async (req) => {
		await RuleModel.deleteOne({ _id: req.params.id })
		return { data: true }
	})

	next()
}

export default addRoutes
