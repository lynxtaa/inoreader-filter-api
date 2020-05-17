import { URLSearchParams } from 'url'

import { FastifyRequest } from 'fastify'

import User, { IUser } from '../models/User'
import { SessionPayload } from './SessionStore'

import { fetchJSON } from './fetchRemote'

export const getUserFromRequest = (
	request: FastifyRequest,
): SessionPayload['user'] | null => request.session.user || null

export function setUserToRequest(
	request: FastifyRequest,
	user: SessionPayload['user'],
) {
	request.session.user = user
}

/**
 * Аутентификация OAuth 2.0 https://www.inoreader.com/developers/oauth
 *
 * @param  authCode  код аутентификации Inoreader
 */
export async function authorizeFromInoreader({
	authCode,
	redirectUri,
}: {
	authCode: string
	redirectUri: string
}): Promise<IUser> {
	console.log({ authCode, redirectUri })
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

	const authData = await fetchJSON<AuthData>(
		'https://www.inoreader.com/oauth2/token',
		{
			method: 'POST',
			body: new URLSearchParams({
				code: authCode,
				redirect_uri: redirectUri,
				client_id: process.env.APP_ID!,
				client_secret: process.env.APP_KEY!,
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

	if (!foundUser) {
		return User.create({ ...userData, rules: [] })
	}

	await foundUser.update(userData)
	const updatedUser = await User.findById(foundUser._id)

	return updatedUser!
}
