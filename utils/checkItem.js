const { flow, get, map, some } = require('lodash/fp')
const match = require('./match')

const or = (...fns) => x => fns.some(fn => fn(x))

const hrefIncludes = filters => flow(get('canonical'), map('href'), some(match(filters)))

const titleIncludes = filters => flow(get('title'), match(filters))

module.exports = ({ hrefs, titles }) => or(hrefIncludes(hrefs), titleIncludes(titles))
