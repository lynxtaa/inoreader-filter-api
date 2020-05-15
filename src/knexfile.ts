import 'dotenv-safe/config'

import { resolve } from 'path'

import { Config } from 'knex'

const config: Config = {
	client: 'pg',
	// https://github.com/knex/knex/issues/3523
	pool: { min: 0, max: 10 },
	debug: true,
	migrations: {
		directory: resolve('../migrations'),
		tableName: 'knex_migrations',
	},
	connection: {
		host: process.env.PGHOST,
		port: Number(process.env.PGPORT),
		user: process.env.PGUSER,
		password: process.env.PGPASSWORD,
		database: process.env.PGDATABASE,
	},
}

export default {
	production: config,
	development: { ...config, debug: true },
}
