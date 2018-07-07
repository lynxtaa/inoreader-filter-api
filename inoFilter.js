const { filter, flow, map, get, join } = require('lodash/fp')
const getUnread = require('./inoreader/getUnread')
const markAsRead = require('./inoreader/markAsRead')
const checkItem = require('./utils/checkItem')

const getTitles = flow(
	map(get('title')),
	join('\n'),
)

module.exports = function({ logger = console } = {}) {
	const run = ({ hrefs, titles }) =>
		getUnread()
			.then(filter(checkItem({ hrefs, titles })))
			.then(
				items =>
					items.length > 0 &&
					markAsRead(items).then(() =>
						logger.info(`Marked as read:\n${getTitles(items)}`),
					),
			)
			.catch(logger.error)

	return { run }
}
