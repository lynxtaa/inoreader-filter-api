import 'dotenv-safe/config'

import ms from 'ms'

import makeApp from './app'
import inoFilter from './inoFilter'

const app = makeApp()

const createdFilter = inoFilter({ logger: app.log })

const INTERVAL = ms('15min')

async function runFilter() {
	try {
		const [hrefs, titles] = await Promise.all([
			app.sqlite.all('SELECT href FROM hrefs'),
			app.sqlite.all('SELECT title FROM titles'),
		])
		await createdFilter.run({
			hrefs: hrefs.map(get('href')),
			titles: titles.map(get('title')),
		})
	} catch (err) {
		app.log.error(err)
	}
}

app.listen(Number(process.env.PORT) || 7000, '0.0.0.0', (err) => {
	if (err) {
		app.log.error(err)
		process.exit(1)
	}

	app.log.info(`Mode: ${process.env.NODE_ENV}`)

	setInterval(runFilter, INTERVAL)
})

process
	.on('uncaughtException', (err) => {
		app.log.fatal(err)
		process.exit(1)
	})
	.on('unhandledRejection', (err) => {
		throw err
	})
