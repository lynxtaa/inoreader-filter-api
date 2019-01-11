require('dotenv-safe').config(
	process.env.CUSTOM_ENV_PATH && { path: process.env.CUSTOM_ENV_PATH },
)

const swagger = require('fastify-swagger')
const handlebars = require('handlebars')
const pointOfView = require('point-of-view')
const fastifyStatic = require('fastify-static')
const { join, resolve } = require('path')
const { readFileSync } = require('fs')
const { get } = require('lodash/fp')
const { name, description, version } = require('./package.json')

const db = require('./db/db')
const routes = require('./routes')
const inoFilter = require('./inoFilter')

const fastify = require('fastify')({
	logger: {
		base: null,
		prettyPrint: { forceColor: process.env.NODE_ENV !== 'production' },
		timestamp: false,
		level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	},
})

fastify.register(pointOfView, {
	engine: { handlebars },
	templates: 'templates',
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
	path: resolve('./db.sqlite'),
	schema: readFileSync(resolve('./db/db-schema.sql'), 'utf8'),
})

fastify.get('/', async (req, reply) => {
	const hrefs = await fastify.sqlite.all('SELECT * FROM hrefs')
	reply.view('/index.handlebars', { hrefs })
})

fastify.register(routes)

const createdFilter = inoFilter({ logger: fastify.log })

const INTERVAL = 15 * 60 * 1000

async function runFilter() {
	try {
		const [hrefs, titles] = await Promise.all([
			fastify.sqlite.all('SELECT href FROM hrefs'),
			fastify.sqlite.all('SELECT title FROM titles'),
		])

		await createdFilter.run({
			hrefs: hrefs.map(get('href')),
			titles: titles.map(get('title')),
		})
	} catch (err) {
		fastify.log.error(err)
	}
}

fastify.listen(process.env.PORT || 7000, '0.0.0.0', err => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}

	fastify.log.info(`Mode: ${process.env.NODE_ENV}`)

	setInterval(runFilter, INTERVAL)

	if (process.env.PRINT_ROUTES && process.env.PRINT_ROUTES !== 'false') {
		fastify.log.debug(fastify.printRoutes())
	}
})

process
	.on('uncaughtException', err => {
		fastify.log.fatal(err)
		process.exit(1)
	})
	.on('unhandledRejection', (reason, p) => {
		fastify.log.error(`Unhandled Rejection at Promise ${p} reason: ${reason}`)
	})
