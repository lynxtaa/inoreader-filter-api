import { resolve } from 'path'

import Fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import GQL from 'fastify-gql'
import fastifyStatic from 'fastify-static'
import fastifySession from 'fastify-session'

import schema, { context } from './schema'
import seconds from './utils/seconds'
import SessionStore from './utils/SessionStore'

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

	fastify.register(fastifySession, {
		secret,
		store: new SessionStore(),
		cookie: {
			httpOnly: true,
			expires: seconds('6 months'),
			sameSite: 'lax',
		},
	})

	fastify.register(GQL, { schema, graphiql: 'playground', context })

	fastify.register(fastifyStatic, {
		root: resolve(__dirname, '../public'),
		prefix: '/public/',
	})

	return fastify
}
