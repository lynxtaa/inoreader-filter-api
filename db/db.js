const fastifyPlugin = require('fastify-plugin')
const { existsSync } = require('fs')
const sqlite = require('sqlite')

/**
 * Fastify Plugin for connecting sqlite-database
 *
 * @param  {Object}  fastify  fastify instance
 * @param  {Object}  options  options
 * @param  {String}  options.path  absolute path for db
 * @param  {String}  options.schema  db schema
 * @returns  {Promise}
 */
async function dbConnector(fastify, { path, schema, ...rest }) {
	const fileExists = existsSync(path)

	const db = await sqlite.open(path, rest)

	if (!fileExists && schema) {
		await db.exec(schema)
	}

	fastify.decorate('sqlite', db)
}

module.exports = fastifyPlugin(dbConnector)
