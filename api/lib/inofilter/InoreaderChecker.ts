import ms from 'ms'

import { RuleModel, Rule } from '../../models/Rule'
import { ArticleProp } from '../../types'

import Inoreader, { Article } from './Inoreader'
import isTextMatchesRule from './isTextMatchesRule'

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

export class InoreaderChecker {
	inoreader: Inoreader
	interval?: NodeJS.Timeout | null
	status: {
		latestRunAt: Date | null
		currentInterval: number | null
	}
	logger: Logger

	constructor({
		inoreader,
		logger = console,
	}: {
		inoreader: Inoreader
		logger?: Logger
	}) {
		this.logger = logger
		this.inoreader = inoreader
		this.status = { latestRunAt: null, currentInterval: null }
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
		try {
			const rules = await RuleModel.find()

			const articles = await this.inoreader.getUnread()

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

				await this.inoreader.markAsRead(articles)

				await RuleModel.updateMany(
					{
						_id: {
							$in: matches.map(([, rule]) => rule._id),
						},
					},
					{
						$inc: { hits: 1 },
						lastHitAt: new Date(),
					},
				)

				this.logger.info(
					`Marked as read:\n${articles.map((article) => article.title).join('\n')}`,
				)
			}

			this.status.latestRunAt = new Date()
		} catch (err) {
			this.logger.error(err)
		} finally {
		}
	}

	runByInterval(interval: string | number): void {
		const milliseconds = typeof interval === 'string' ? ms(interval) : interval

		this.status.currentInterval = milliseconds

		this.run()
		this.interval = setInterval(this.run.bind(this), milliseconds)
	}
}
