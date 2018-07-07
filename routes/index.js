const hrefs = require('./hrefs')
const titles = require('./titles')

module.exports = (fastify, options, next) => {
	hrefs(fastify)
	titles(fastify)

	next()
}
