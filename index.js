require('dotenv').config()

const { filter, flow, map, get, join } = require('lodash/fp')
const logger = require('./logger')
const getUnread = require('./inoreader/getUnread')
const markAsRead = require('./inoreader/markAsRead')
const checkItem = require('./utils/checkItem')
const config = require('./config.json')

const getTitles = flow(map(get('title')), join('\n'))

getUnread()
	.then(filter(checkItem(config)))
	.then(
		items =>
			items.length > 0 &&
			markAsRead(items).then(() => logger(`Marked as read:\n${getTitles(items)}`)),
	)
	.catch(logger)
