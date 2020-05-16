import { Article } from '../inoreader/getUnread'

import match from './match'

const or = <T>(...fns: ((val: T) => boolean)[]) => (x: T) => fns.some((fn) => fn(x))

const hrefIncludes = (filters: string[]) => (article: Article) =>
	article.canonical.map((el) => el.href).some(match(filters))

const titleIncludes = (filters: string[]) => (article: Article) =>
	match(filters)(article.title)

export default function checkItem({
	hrefs,
	titles,
}: {
	hrefs: string[]
	titles: string[]
}) {
	return or(hrefIncludes(hrefs), titleIncludes(titles))
}
