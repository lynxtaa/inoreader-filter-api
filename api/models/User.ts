import { Schema, Document, model } from 'mongoose'

import Rule, { IRule } from './Rule'

export interface IUser extends Document {
	createdAt: Date
	name: string
	email: string
	inoreaderUserId: string
	inoreaderAccessToken: string
	inoreaderTokenType: string
	inoreaderRefreshToken: string
	inoreaderAccessTokenExpiresAt: Date
	rules: IRule[]
}

export default model<IUser>(
	'User',
	new Schema({
		createdAt: { type: Date, default: Date.now },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		inoreaderUserId: { type: String, required: true, unique: true },
		inoreaderAccessToken: { type: String, required: true },
		inoreaderTokenType: { type: String, required: true },
		inoreaderRefreshToken: { type: String, required: true },
		inoreaderAccessTokenExpiresAt: { type: Date, required: true },
		rules: { type: [Rule.schema], required: true },
	}),
)
