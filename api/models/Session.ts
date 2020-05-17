import { Schema, Document, model } from 'mongoose'
import ms from 'ms'

export interface ISession extends Document {
	uuid: string
	lastUsedAt: Date
	payload: { userId: string }
}

export default model<ISession>(
	'Session',
	new Schema({
		uuid: { type: String, required: true, unique: true },
		lastUsedAt: {
			type: Date,
			default: Date.now,
			required: true,
			expires: ms('30d') / 1000,
		},
		payload: {
			userId: { type: String, required: true },
		},
	}),
)
