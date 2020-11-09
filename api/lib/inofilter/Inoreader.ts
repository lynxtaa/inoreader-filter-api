import { URLSearchParams } from 'url'

import fetch, { RequestInit } from 'node-fetch'

export type Article = {
	id: string
	title: string
	canonical: { href: string }[]
}

export type InoreaderOptions = {
	appId: string
	appKey: string
	auth: string
}

export default class Inoreader {
	appId: string
	appKey: string
	auth: string

	constructor({ appId, appKey, auth }: InoreaderOptions) {
		this.appId = appId
		this.appKey = appKey
		this.auth = auth
	}

	private async fetchApi(url: string, options?: RequestInit) {
		const response = await fetch(`https://www.inoreader.com/reader/api/0${url}`, {
			...options,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				AppId: this.appId,
				AppKey: this.appKey,
				Authorization: `GoogleLogin auth=${this.auth}`,
			},
		})

		if (!response.ok) {
			throw new Error((await response.text()) || response.statusText)
		}

		return response
	}

	async getUnread(): Promise<Article[]> {
		const response = await this.fetchApi(
			'/stream/contents?n=100&xt=user/-/state/com.google/read',
		)
		const result = await response.json()

		return result.items
	}

	async markAsRead(articles: Article[]): Promise<void> {
		const searchParams = new URLSearchParams()
		searchParams.append('a', 'user/-/state/com.google/read')

		for (const article of articles) {
			searchParams.append('i', article.id)
		}

		await this.fetchApi(`/edit-tag?${searchParams}`, { method: 'POST' })
	}
}
