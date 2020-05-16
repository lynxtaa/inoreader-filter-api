import { Schema, Document, model } from 'mongoose'

import Rule, { IRule } from './Rule'

export interface IUser extends Document {
	createdAt: Date
	inoreaderUserId: string
	inoreaderUserName: string
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
		inoreaderUserId: { type: String, required: true, unique: true },
		inoreaderUserName: { type: String, required: true },
		inoreaderAccessToken: { type: String, required: true },
		inoreaderTokenType: { type: String, required: true },
		inoreaderRefreshToken: { type: String, required: true },
		inoreaderAccessTokenExpiresAt: { type: Date, required: true },
		rules: { type: [Rule.schema], required: true },
	}),
)
