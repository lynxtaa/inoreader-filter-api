import { URLSearchParams } from 'url'

import User from '../../models/User'
import { fetchJSON } from '../../utils/fetchRemote'
import { Context } from '../context'

type AuthData = {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
}

type UserInfo = {
	userId: string
	userName: string
	userEmail: string
}

export default {
	Mutation: {
		async authorize(_: any, authCode: string, { request }: Context) {
			const authData = await fetchJSON<AuthData>(
				'https://www.inoreader.com/oauth2/token',
				{
					method: 'POST',
					body: new URLSearchParams({
						code: authCode,
						redirect_uri: undefined,
						client_id: process.env.APP_ID!,
						client_secret: process.env.SECRET!,
						scope: '',
						grant_type: 'authorization_code',
					}),
				},
			)

			const userInfo = await fetchJSON<UserInfo>(
				'https://www.inoreader.com/reader/api/0/user-info',
				{
					headers: {
						Authorization: `${authData.token_type} ${authData.access_token}`,
					},
				},
			)

			const foundUser = await User.findOne({ inoreaderUserId: userInfo.userId })

			const userData = {
				name: userInfo.userName,
				email: userInfo.userEmail,
				inoreaderUserId: userInfo.userId,
				inoreaderAccessToken: authData.access_token,
				inoreaderTokenType: authData.token_type,
				inoreaderRefreshToken: authData.refresh_token,
				inoreaderAccessTokenExpiresAt: Date.now() + authData.expires_in * 1000,
			}

			if (foundUser) {
				request.session.user = { id: foundUser._id }
				await foundUser.update(userData)
			} else {
				const newUser = await User.create({ ...userData, rules: [] })

				request.session.user = { id: newUser._id }
			}

			return true
		},
		async user(_: any, { id }: { id: string }) {
			const user = await User.findById(id)
			return user
		},
		async users() {
			const users = await User.find().sort('id')
			return users
		},
	},
}
