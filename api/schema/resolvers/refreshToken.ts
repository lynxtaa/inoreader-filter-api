import { Forbidden } from 'http-errors'
import ms from 'ms'

import User from '../../models/User'
import {
	getRefreshToken,
	AccessToken,
	RefreshToken,
	sendRefreshToken,
	clearRefreshToken,
} from '../../utils/auth'
import { Context } from '../context'

export default {
	Mutation: {
		async refreshToken(_: any, args: any, { request, reply }: Context) {
			const refreshToken = getRefreshToken(request)

			try {
				if (!refreshToken) {
					throw new Forbidden('Refresh token required')
				}

				const { userId } = RefreshToken.verify(refreshToken)

				const user = await User.findById(userId)

				if (!user) {
					throw new Forbidden('User not found')
				}

				const accessToken = AccessToken.sign({ userId: user._id })
				const newRefreshToken = RefreshToken.sign({ userId: user._id })

				sendRefreshToken(reply, newRefreshToken)

				return {
					accessToken,
					expiresIn:
						typeof AccessToken.expiresIn === 'string'
							? ms(AccessToken.expiresIn) / 1000
							: AccessToken.expiresIn,
					tokenType: 'Bearer',
					user: user,
				}
			} catch (err) {
				clearRefreshToken(reply)
				throw err
			}
		},
	},
}
