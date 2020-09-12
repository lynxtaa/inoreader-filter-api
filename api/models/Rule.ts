import { Schema, Document, model } from 'mongoose'

export enum ArticleProp {
	Href = 'href',
	Title = 'title',
}

export enum FilterType {
	Contains = 'contains',
	Equal = 'equal',
}

export interface Rule extends Document {
	createdAt: Date
	hits: number
	lastHitAt: Date | null
	isActive: boolean
	ruleDef: {
		prop: ArticleProp
		type: FilterType
		negate: boolean
		value: string
	}
}

export default model<Rule>(
	'Rule',
	new Schema({
		createdAt: { type: Date, required: true },
		isActive: { type: Boolean, required: true, default: true },
		hits: { type: Number, default: 0 },
		lastHitAt: { type: Date, default: null },
		ruleDef: {
			prop: { type: String, required: true, enum: Object.values(ArticleProp) },
			type: { type: String, required: true, enum: Object.values(FilterType) },
			negate: { type: Boolean, default: false },
			value: { type: String, required: true, maxlength: 128, minLength: 2 },
		},
	}),
)
