import RuleModel, { ArticleProp, Rule } from '../../models/Rule'
import Inoreader, { Article } from './Inoreader'
import isTextMatchesRule from './isTextMatchesRule'

const inoreader = new Inoreader({
	appId: process.env.APP_ID!,
	auth: process.env.AUTH!,
	appKey: process.env.APP_KEY!,
})

export default function inofilter({
	logger = console,
}: {
	logger?: {
		info: (text: string) => void
		error: (text: string) => void
	}
} = {}): {
	run: () => Promise<void>
} {
	async function run() {
		try {
			const rules = await RuleModel.find()

			const articles = await inoreader.getUnread()

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

				await inoreader.markAsRead(articles)

				await RuleModel.updateMany(
					{ _id: matches.map(([, rule]) => rule._id) },
					{
						$inc: { hits: 1 },
						lastHitAt: new Date(),
					},
				)

				logger.info(
					`Marked as read:\n${articles.map((article) => article.title).join('\n')}`,
				)
			}
		} catch (err) {
			logger.error(err)
		}
	}

	return { run }
}
