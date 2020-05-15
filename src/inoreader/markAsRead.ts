import { URLSearchParams } from 'url'

import fetchApi from './fetchApi'
import { Article } from './getUnread'

export default function markAsRead(articles: Article[]) {
	const searchParams = new URLSearchParams()
	searchParams.append('a', 'user/-/state/com.google/read')

	for (const article of articles) {
		searchParams.append('i', article.id)
	}

	return fetchApi(`/edit-tag?${searchParams}`, { method: 'POST' })
}
