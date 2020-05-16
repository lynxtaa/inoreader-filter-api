import { Schema, Document, model } from 'mongoose'

enum ArticleProp {
	Href = 'href',
	Title = 'title',
}

enum FilterType {
	Contains = 'contains',
	Equal = 'equal',
	MatchRegexp = 'matchRegexp',
}

export interface IRule extends Document {
	createdAt: Date
	isActive: boolean
	lastHitAt?: Date | null
	hits: number
	ruleDef: {
		prop: ArticleProp
		type: FilterType
		negate?: boolean
		value: string
	}
}

export default model<IRule>(
	'Rule',
	new Schema({
		createdAt: { type: Date, default: Date.now },
		isActive: { type: Boolean, required: true },
		lastHitAt: Date,
		hits: { type: Number, required: true },
		ruleDef: {
			prop: { type: String, required: true, enum: Object.values(ArticleProp) },
			type: { type: String, required: true, enum: Object.values(FilterType) },
			negate: Boolean,
			value: { type: String, required: true, maxlength: 128 },
		},
	}),
)
