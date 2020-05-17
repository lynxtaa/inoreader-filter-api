import gql from './gql'
import { refreshToken as refreshTokenType } from 'gql/queries'
import { GraphQLClient } from 'graphql-hooks'

let authorization: string | undefined
let expireAt: number | undefined

const client = new GraphQLClient({ url: '/graphql' })

const REFRESH_TOKEN = gql`
	mutation refreshToken {
		refreshToken {
			accessToken
			expiresIn
			tokenType
		}
	}
`

async function refresh() {
	const { data, error } = await client.request<refreshTokenType>({
		query: REFRESH_TOKEN,
	})

	if (error) {
		throw new Error('Refresh error')
	}

	const { accessToken, expiresIn, tokenType } = data!.refreshToken

	authorization = `${tokenType} ${accessToken}`
	expireAt = Date.now() + expiresIn * 1000
}

export default async function fetchWithAuth(
	input: RequestInfo,
	init?: RequestInit,
) {
	if (!authorization) {
		try {
			await refresh()
		} catch (err) {}
	}

	if (authorization && expireAt && expireAt - Date.now() < 500) {
		try {
			await refresh()
		} catch (err) {
			authorization = undefined
			expireAt = undefined
		}
	}

	const newHeaders = authorization
		? { Authorization: authorization }
		: undefined

	return fetch(input, {
		...init,
		headers: {
			...init?.headers,
			...newHeaders,
		},
	})
}
