const { add, flow, map, get, join } = require('lodash/fp')
const fetchApi = require('./fetchApi')

const getQuery = flow(
	map(add('i=')),
	join('&'),
	add('a=user/-/state/com.google/read&'),
)

module.exports = flow(map(get('id')), getQuery, query =>
	fetchApi(`/edit-tag?${query}`, { method: 'POST' }),
)
