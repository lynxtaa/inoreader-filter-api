import {
	FastifyMiddleware,
	// @ts-ignore
	DefaultQuery,
	// @ts-ignore
	DefaultParams,
	// @ts-ignore
	DefaultHeaders,
	// @ts-ignore
	FastifyRequest,
} from 'fastify'

import { AccessTokenPayload, AccessToken } from '../utils/auth'

declare module 'fastify' {
	interface FastifyRequest<
		HttpRequest,
		Query = DefaultQuery,
		Params = DefaultParams,
		Headers = DefaultHeaders,
		Body = any
	> {
		user: AccessTokenPayload | null
	}
}

const authHook: FastifyMiddleware = async function (request) {
	request.user = null

	if (!/Bearer .+/.test(request.headers.authorization || '')) {
		return
	}

	const token = request.headers.authorization.split(' ')[1]

	const payload = AccessToken.verify(token)

	request.user = payload
}

export default authHook
