import { clearRefreshToken } from '../../utils/auth'
import { Context } from '../context'

export default {
	Mutation: {
		logout(_: any, args: any, { reply }: Context) {
			clearRefreshToken(reply)
			return true
		},
	},
}
