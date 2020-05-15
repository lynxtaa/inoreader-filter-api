import knex from 'knex'
import { knexSnakeCaseMappers } from 'objection'

import knexfile from './knexfile'

const { NODE_ENV } = process.env

const envs = Object.keys(knexfile)

if (!NODE_ENV || !envs.includes(NODE_ENV)) {
	throw new Error(`NODE_ENV should be one of: ${envs.join(', ')}`)
}

export default knex({
	...knexfile[NODE_ENV as keyof typeof knexfile],
	...knexSnakeCaseMappers(),
})
