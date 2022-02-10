import { Server, IncomingMessage, ServerResponse } from 'http'
import path from 'path'

import Fastify, { FastifyInstance } from 'fastify'
import fastifyNextjs from 'fastify-nextjs'
import fastifyStatic from 'fastify-static'
import ms from 'ms'
import pino, { P } from 'pino'

import connectMongo from './connectMongo'
import inofilter from './lib/inofilter'
import routes from './routes'

export default function createApp({
	logLevel,
}: { logLevel?: P.LevelWithSilent } = {}): FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse,
	P.Logger
> {
	const fastify = Fastify({
		logger: pino({
			base: null, // отключаем логирование PID и имени хоста
			timestamp: false,
			level: logLevel || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
			transport:
				process.env.NODE_ENV !== 'production'
					? {
							target: 'pino-pretty',
							options: { colorize: true },
					  }
					: undefined,
		}),
	})

	inofilter.setLogger(fastify.log)

	fastify.addHook('onClose', (instance, done) => {
		inofilter.stop()
		done()
	})

	fastify.addHook('onReady', async () => {
		await connectMongo()
		inofilter.runByInterval(ms(process.env.INTERVAL || '15min'))
	})

	fastify.register(fastifyStatic, {
		root: path.join(__dirname, '../public'),
	})

	fastify
		.register(fastifyNextjs, { dev: process.env.NODE_ENV !== 'production' })
		.after(() => {
			fastify.next('/')
		})

	fastify.register(routes, { prefix: '/api' })

	return fastify
}
