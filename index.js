/* eslint-disable no-console */

require('dotenv').config()

const { filter } = require('lodash/fp')
const logger = require('./logger')
const getUnread = require('./inoreader/getUnread')
const checkItem = require('./utils/checkItem')
const config = require('./config.json')

getUnread()
	.then(items => {
		logger(items.length)
		return items
	})
	.then(filter(checkItem(config)))
	.then(items => {
		logger(items.length)
	})
	.catch(console.log.bind(console))
