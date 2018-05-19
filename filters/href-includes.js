const { flow, get, map, every } = require('lodash/fp')
const { isRegExp } = require('lodash')

const testHref = href => filter =>
	isRegExp(filter) ? filter.test(href) : href.includes(filter)

module.exports = (...filters) =>
	flow(get('canonical'), map('href'), some(href => filters.some(testHref(href))))
