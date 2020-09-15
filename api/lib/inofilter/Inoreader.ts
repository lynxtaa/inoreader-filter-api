import ms from 'ms'
import fetch, { RequestInit } from 'node-fetch'
import { URLSearchParams } from 'url'
import RuleModel, { Rule } from '../../models/Rule'
import { ArticleProp } from '../../types'
import isTextMatchesRule from './isTextMatchesRule'

export type Article = {
	id: string
	title: string
	canonical: { href: string }[]
}

type Logger = {
	info: (text: string) => void
	error: (text: string) => void
}

export type InoreaderOptions = {
	appId: string
	appKey: string
	auth: string
	logger?: Logger
}

export default class Inoreader {
	appId: string
	appKey: string
	auth: string
	interval?: NodeJS.Timeout | null
	status: {
		latestRunAt: Date | null
		currentInterval: number | null
	}
	logger: Logger

	constructor({ appId, appKey, auth, logger = console }: InoreaderOptions) {
		this.appId = appId
		this.appKey = appKey
		this.auth = auth
		this.logger = logger
		this.status = { latestRunAt: null, currentInterval: null }
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

	setLogger(logger: Logger): void {
		this.logger = logger
	}

	getStatus(): {
		latestRunAt: Date | null
		currentInterval: number | null
	} {
		return this.status
	}

	stop(): void {
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = null
			this.status.currentInterval = null
		}
	}

	private async run() {
		console.log('hello')
		try {
			const rules = await RuleModel.find()

			const articles = await this.getUnread()

			const hrefRules = rules.filter((rule) => rule.ruleDef.prop === ArticleProp.Href)
			const titleRules = rules.filter((rule) => rule.ruleDef.prop === ArticleProp.Title)

			const matches: [Article, Rule][] = []

			for (const article of articles) {
				const matchedRule =
					hrefRules.find((rule) =>
						article.canonical.some((el) => isTextMatchesRule(el.href, rule)),
					) || titleRules.find((rule) => isTextMatchesRule(article.title, rule))

				if (matchedRule) {
					matches.push([article, matchedRule])
				}
			}

			if (matches.length > 0) {
				const articles = matches.map(([article]) => article)

				await this.markAsRead(articles)

				await RuleModel.updateMany(
					{ _id: matches.map(([, rule]) => rule._id) },
					{
						$inc: { hits: 1 },
						lastHitAt: new Date(),
					},
				)

				this.status.latestRunAt = new Date()

				this.logger.info(
					`Marked as read:\n${articles.map((article) => article.title).join('\n')}`,
				)
			}
		} catch (err) {
			this.logger.error(err)
		}
	}

	runByInterval(interval: string | number): void {
		const milliseconds = typeof interval === 'string' ? ms(interval) : interval

		this.status.currentInterval = milliseconds

		this.run()
		this.interval = setInterval(this.run.bind(this), milliseconds)
	}
}
