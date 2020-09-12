import { Rule, FilterType } from '../../models/Rule'

function matchByType(text: string, { ruleDef }: Rule) {
	switch (ruleDef.type) {
		case FilterType.Contains:
			return text.includes(ruleDef.value)
		case FilterType.Equal:
			return text === ruleDef.value
		default:
			throw new Error()
	}
}

export default function isTextMatchesRule(text: string, rule: Rule): boolean {
	const { negate } = rule.ruleDef

	const match = matchByType(text, rule)

	return negate ? !match : match
}
