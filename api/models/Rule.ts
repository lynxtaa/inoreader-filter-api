import {
	prop,
	modelOptions,
	getModelForClass,
	defaultClasses,
} from '@typegoose/typegoose'
import { models } from 'mongoose'

import { ArticleProp, FilterType } from '../types'

@modelOptions({ schemaOptions: { _id: false } })
class RuleDef {
	@prop({ enum: ArticleProp, type: String })
	prop!: ArticleProp

	@prop({ enum: FilterType, type: String })
	type!: FilterType

	@prop({ default: false })
	negate?: boolean

	@prop({ maxlength: 128, minlength: 2 })
	value!: string
}

@modelOptions({
	schemaOptions: {
		toJSON: {
			transform(document, returnedObject) {
				returnedObject.createdAt = returnedObject.createdAt.toISOString()
				if (returnedObject.lastHitAt) {
					returnedObject.lastHitAt = returnedObject.lastHitAt.toISOString()
				}
				returnedObject._id = returnedObject._id.toString()
				delete returnedObject.ruleDef._v
				delete returnedObject._v
			},
		},
	},
})
export class Rule extends defaultClasses.Base {
	@prop()
	createdAt!: Date

	@prop({ default: 0 })
	hits!: number

	@prop()
	lastHitAt?: Date

	@prop()
	isActive!: boolean

	@prop()
	ruleDef!: RuleDef
}

const ModelForClass = getModelForClass(Rule)

export const RuleModel: typeof ModelForClass = models?.Rule || ModelForClass
