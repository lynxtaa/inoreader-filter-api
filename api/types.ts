export enum ArticleProp {
	Href = 'href',
	Title = 'title',
}

export enum FilterType {
	Contains = 'contains',
	Equal = 'equal',
}

export type RuleData = {
	_id: string
	createdAt: string
	isActive: boolean
	lastHitAt: string | null
	hits: number
	ruleDef: {
		prop: ArticleProp
		type: FilterType
		negate: boolean
		value: string
	}
}
