const hrefs = require('./hrefs')
const titles = require('./titles')

module.exports = (fastify, options, next) => {
	fastify.get('/', async (req, reply) => {
		const [hrefs, titles] = await Promise.all([
			fastify.sqlite.all('SELECT * FROM hrefs ORDER BY href'),
			fastify.sqlite.all('SELECT * FROM titles ORDER BY title'),
		])

		reply.view('/index.ejs', { hrefs, titles })
	})

	hrefs(fastify)
	titles(fastify)

	next()
}
