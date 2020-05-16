import { ServerResponse } from 'http'

import { FastifyRequest, FastifyReply } from 'fastify'

type User = {
	_id: string
}

function createContext(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>,
) {
	const user: User | undefined = request.session.user
	return { user: user || null, request, reply }
}

export type Context = ReturnType<typeof createContext>

export default createContext
