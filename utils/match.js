const { isRegExp } = require('lodash')

module.exports = filters => str =>
	filters.some(filter => (isRegExp(filter) ? filter.test(str) : str.includes(filter)))
