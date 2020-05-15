import BaseModel from './BaseModel'

enum ArticleProp {
	Href = 'href',
	Title = 'title',
}

enum FilterType {
	Contains = 'contains',
	Equal = 'equal',
	MatchRegexp = 'matchRegexp',
}

type FilterRule = {
	prop: ArticleProp
	type: FilterType
	negate?: boolean
	value: string
}

export default class Rule extends BaseModel {
	id!: number
	createdAt!: Date
	isActive!: boolean
	lastHitAt!: Date | null
	hits!: number
	rule!: FilterRule
	userId!: number

	static tableName = 'rules'

	static jsonAttributes = ['rule']

	static jsonSchema = {
		type: 'object',
		properties: {
			rule: {
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
	}
}
