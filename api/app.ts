import { resolve } from 'path'

import Fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import GQL from 'fastify-gql'
import fastifyStatic from 'fastify-static'

import addUserFromToken from './hooks/addUserFromToken'
import schema, { context } from './schema'

export default function app({
	env,
	secret,
	logLevel,
}: {
	env: string
	logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
	secret: string
}) {
	const fastify = Fastify({
		logger: {
			base: null,
			prettyPrint: env !== 'production' && { colorize: true },
			timestamp: false,
			level: logLevel || (env === 'production' ? 'info' : 'debug'),
		},
	})

	fastify.register(fastifyCookie)

	fastify.register(GQL, { schema, graphiql: 'playground', context })

	fastify.register(fastifyStatic, {
		root: resolve(__dirname, '../public'),
		prefix: '/public/',
	})

	fastify.addHook('preHandler', addUserFromToken)

	return fastify
}
