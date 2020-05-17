import { ServerResponse } from 'http'

import { FastifyRequest, FastifyReply } from 'fastify'

const createContext = (
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>,
) => ({ user: request.user, request, reply })

export type Context = ReturnType<typeof createContext>

export default createContext
