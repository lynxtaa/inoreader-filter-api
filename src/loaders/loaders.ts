import { Options } from 'fastify-gql'

import User from '../models/User'
import pluck from '../utils/pluck'

const loaders: Options['loaders'] = {
	User: {
		rules: (queries) =>
			User.fetchGraph(
				queries.map((query) => query.obj),
				'rules(orderById)',
			).then(pluck('rules')),
	},
}

export default loaders
