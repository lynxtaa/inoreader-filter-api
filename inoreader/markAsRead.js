const { add, concat, flow, map, get, join } = require('lodash/fp')
const fetchApi = require('./fetchApi')

const getQuery = flow(
	map(add('i=')),
	concat('a=user/-/state/com.google/read'),
	join('&'),
)

module.exports = flow(map(get('id')), getQuery, query =>
	fetchApi(`/edit-tag?${query}`, { method: 'POST' }),
)
