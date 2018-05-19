require('dotenv').config()

const { filter, flow, map, get, join, truncate } = require('lodash/fp')
const logger = require('./logger')
const getUnread = require('./inoreader/getUnread')
const markAsRead = require('./inoreader/markAsRead')
const checkItem = require('./utils/checkItem')
const config = require('./config.json')

const shorten = truncate({ length: 50 })
const getTitles = flow(map(get('title')), map(shorten), join('\n'))

getUnread()
	.then(filter(checkItem(config)))
	.then(
		items =>
			items.length > 0
				? markAsRead(items).then(() => `Marked as read:\n${getTitles(items)}`)
				: 'No matches',
	)
	.then(logger)
	.catch(logger)
