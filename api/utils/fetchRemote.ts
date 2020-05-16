import fetch, { RequestInit } from 'node-fetch'

export default async function fetchRemote(
	url: string,
	params: RequestInit = {},
) {
	const response = await fetch(url, params)

	if (!response.ok) {
		const text = await response.text()
		throw new Error(
			`Request ${response.url} failed: ${text} (${response.status})`,
		)
	}

	return response
}

export async function fetchJSON<TData>(url: string, params: RequestInit = {}) {
	const response = await fetchRemote(url, params)
	const json = await response.json()
	return json as TData
}
