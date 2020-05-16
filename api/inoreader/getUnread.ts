import fetchApi from './fetchApi'

export type Article = {
	id: string
	title: string
	canonical: { href: string }[]
}

export default async function getUnread() {
	const response = await fetchApi(
		'/stream/contents?n=100&xt=user/-/state/com.google/read',
	)
	const { items }: { items: Article[] } = await response.json()
	return items
}
