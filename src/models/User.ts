import BaseModel from './BaseModel'
import Rule from './Rule'

export default class User extends BaseModel {
	id!: number
	createdAt!: Date

	inoreaderUserId!: string
	inoreaderUserName!: string
	inoreaderAccessToken!: string
	inoreaderTokenType!: string
	inoreaderRefreshToken!: string
	inoreaderAccessTokenExpiresAt!: Date

	rules!: Rule[]

	static tableName = 'users'

	static relationMappings = {
		rules: {
			relation: BaseModel.HasManyRelation,
			modelClass: 'Rule',
			join: { from: 'users.id', to: 'rules.userIFd' },
		},
	}
}
