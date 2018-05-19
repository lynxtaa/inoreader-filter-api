/* eslint-disable no-console */

require('dotenv').config()

const { filter, get } = require('lodash/fp')
const logger = require('./logger')
const fetchApi = require('./fetchApi')
const hrefIncludes = require('./filters/href-includes')

fetchApi('/stream/contents?n=100&xt=user/-/state/com.google/read')
	.then(get('items'))
	.then(items => {
		console.log(items.length)
		return items
	})
	.then(filter(hrefIncludes('/r/hmmm')))
	.then(items => {
		console.log(items.length)
		return items
	})
	// .then(console.log.bind(console))
	.catch(console.log.bind(console))
