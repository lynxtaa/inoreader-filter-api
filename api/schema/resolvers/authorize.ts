import { URL } from 'url'

import { authorizeFromInoreader, setUserToRequest } from '../../utils/auth'
import { Context } from '../context'

export default {
	Mutation: {
		async authorize(
			_: any,
			{ authCode }: { authCode: string },
			{ request }: Context,
		) {
			const refererUrl = new URL(request.headers.referer)

			const user = await authorizeFromInoreader({
				authCode,
				redirectUri: `${refererUrl.origin}${refererUrl.pathname}`,
			})

			setUserToRequest(request, { id: user._id })

			return true
		},
	},
}
