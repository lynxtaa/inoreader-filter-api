import { Model, QueryBuilder } from 'objection'

import knex from '../db'

Model.knex(knex)

export default class BaseModel extends Model {
	static modifiers = {
		orderById: (builder: QueryBuilder<any>) => builder.orderBy('id'),
	}

	static useLimitInFirst = true

	static modelPaths = [__dirname]
}
