import getUnread from './inoreader/getUnread'
import markAsRead from './inoreader/markAsRead'
import checkItem from './utils/checkItem'

type Logger = {
	info: (message: string) => void
	error: (message: string | Error) => void
}

export default function inoFilter({
	logger = console,
}: {
	logger?: Logger
} = {}) {
	const run = ({ hrefs, titles }: { hrefs: string[]; titles: string[] }) =>
		getUnread()
			.then((articles) => articles.filter(checkItem({ hrefs, titles })))
			.then(async (items) => {
				if (items.length > 0) {
					await markAsRead(items)
					logger.info(`Marked as read:\n${items.map((item) => item.title).join('\n')}`)
				}
			})
			.catch(logger.error)

	return { run }
}
