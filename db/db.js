const fastifyPlugin = require('fastify-plugin')
const { existsSync } = require('fs')
const sqlite = require('sqlite')

async function dbConnector(fastify, { path, schema, ...rest }) {
	const fileExists = existsSync(path)

	const db = await sqlite.open(path, rest)

	if (!fileExists && schema) {
		await db.exec(schema)
	}

	fastify.decorate('sqlite', db)
}

module.exports = fastifyPlugin(dbConnector)
