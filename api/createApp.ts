import { Server, IncomingMessage, ServerResponse } from 'http'
import Fastify, { FastifyInstance } from 'fastify'
import pino, { LevelWithSilent, Logger } from 'pino'

import routes from './routes'
import fastifyStatic from 'fastify-static'
import { join } from 'path'

export default function createApp({
	logLevel,
}: { logLevel?: LevelWithSilent } = {}): FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse,
	Logger
> {
	const fastify = Fastify({
		logger: pino({
			base: null, // отключаем логирование PID и имени хоста
			prettyPrint: process.env.NODE_ENV !== 'production' && { colorize: true },
			timestamp: false,
			level: logLevel || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
		}),
	})

	fastify.register(fastifyStatic, {
		root: join(__dirname, '../build'),
	})

	fastify.register(routes, { prefix: '/api' })

	return fastify
}
