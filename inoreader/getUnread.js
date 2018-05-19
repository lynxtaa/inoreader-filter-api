const { get } = require('lodash/fp')

const fetchApi = require('./fetchApi')

module.exports = () =>
	fetchApi('/stream/contents?n=100&xt=user/-/state/com.google/read').then(get('items'))
