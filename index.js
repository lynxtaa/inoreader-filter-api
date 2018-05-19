/* eslint-disable no-console */

require('dotenv').config()

const { filter, get } = require('lodash/fp')
const logger = require('./logger')
const fetchApi = require('./utils/fetchApi')
const filters = require('./filters')
const config = require('./config.json')

fetchApi('/stream/contents?n=100&xt=user/-/state/com.google/read')
	.then(get('items'))
	.then(items => {
		logger(items.length)
		return items
	})
	.then(filter(filters(config)))
	.then(items => {
		logger(items.length)
	})
	.catch(console.log.bind(console))
