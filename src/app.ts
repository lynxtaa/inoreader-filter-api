import { resolve } from 'path'

import ejs from 'ejs'
import Fastify from 'fastify'
import GQL from 'fastify-gql'
import fastifySecureSession from 'fastify-secure-session'
import fastifyStatic from 'fastify-static'
import pointOfView from 'point-of-view'

import loaders from './loaders/loaders'
import schema from './schema'

export default function app({
	logLevel,
}: {
	logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
} = {}) {
	const fastify = Fastify({
		logger: {
			base: null,
			prettyPrint: process.env.NODE_ENV !== 'production' && { colorize: true },
			timestamp: false,
			level: logLevel || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
		},
	})

	fastify.register(fastifySecureSession, {
		secret: 'averylogphrasebiggerthanthirtytwochars',
		salt: 'mq9hDxBVDbspDR6n',
	})

	fastify.register(GQL, {
		schema,
		loaders,
		context: (request: any, reply: any) => ({
			request,
			reply,
			user: request.session.get('user'),
		}),
	})

	fastify.register(pointOfView, {
		engine: { ejs },
		templates: 'templates',
		options: { filename: resolve('templates') },
	})

	fastify.register(fastifyStatic, {
		root: resolve('../public'),
		prefix: '/public/',
	})

	return fastify
}
