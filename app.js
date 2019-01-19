const swagger = require('fastify-swagger')
const ejs = require('ejs')
const pointOfView = require('point-of-view')
const fastifyStatic = require('fastify-static')
const fastifyCompress = require('fastify-compress')
const { join, resolve } = require('path')
const { readFileSync } = require('fs')
const Fastify = require('fastify')
const { name, description, version } = require('./package.json')

const db = require('./db/db')
const routes = require('./routes')

module.exports = function({
	dbPath = resolve('./db.sqlite'),
	logger = {
		base: null,
		prettyPrint: { forceColor: process.env.NODE_ENV !== 'production' },
		timestamp: false,
		level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	},
} = {}) {
	const fastify = Fastify({ logger })

	fastify.register(fastifyCompress)

	fastify.register(pointOfView, {
		engine: { ejs },
		templates: 'templates',
		options: { filename: resolve('templates') },
	})

	fastify.register(fastifyStatic, {
		root: join(__dirname, 'public'),
		prefix: '/public/',
	})

	fastify.register(swagger, {
		exposeRoute: true,
		swagger: {
			info: {
				title: `${name} v${version}`,
				description,
				version: '0.1.0',
			},
			consumes: ['application/json'],
			produces: ['application/json'],
		},
	})

	fastify.register(db, {
		path: dbPath,
		schema: readFileSync(resolve('./db/db-schema.sql'), 'utf8'),
	})

	fastify.register(routes)

	return fastify
}
