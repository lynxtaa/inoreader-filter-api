import { ServerResponse } from 'http'

import { FastifyRequest, FastifyReply } from 'fastify'

import { getUserFromRequest } from '../utils/auth'

const createContext = (
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>,
) => ({ user: getUserFromRequest(request), request, reply })

export type Context = ReturnType<typeof createContext>

export default createContext
