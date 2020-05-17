import { URL } from 'url'
import ms from 'ms'

import {
	AccessToken,
	RefreshToken,
	sendRefreshToken,
	authorizeFromInoreader,
} from '../../utils/auth'
import { Context } from '../context'

export default {
	Mutation: {
		async authorize(
			_: any,
			{ authCode }: { authCode: string },
			{ reply, request }: Context,
		) {
			const refererUrl = new URL(request.headers.referer)

			const user = await authorizeFromInoreader({
				authCode,
				redirectUri: `${refererUrl.origin}${refererUrl.pathname}`,
			})

			const accessToken = AccessToken.sign({ userId: user._id })
			const refreshToken = RefreshToken.sign({ userId: user._id })

			sendRefreshToken(reply, refreshToken)

			return {
				accessToken,
				expiresIn:
					typeof AccessToken.expiresIn === 'string'
						? ms(AccessToken.expiresIn) / 1000
						: AccessToken.expiresIn,
				tokenType: 'Bearer',
				user: user,
			}
		},
	},
}
