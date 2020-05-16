import fetch, { RequestInit } from 'node-fetch'

const { APP_ID, APP_KEY, AUTH } = process.env

export default async function fetchApi(url: string, params: RequestInit = {}) {
	const response = await fetch(`https://www.inoreader.com/reader/api/0${url}`, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			AppId: APP_ID!,
			AppKey: APP_KEY!,
			Authorization: `GoogleLogin auth=${AUTH}`,
		},
		...params,
	})

	if (!response.ok) {
		const text = await response.text()
		throw new Error(
			`Request ${response.url} failed: ${text} (${response.status})`,
		)
	}

	return response
}
