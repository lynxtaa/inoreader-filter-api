import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'

import permissions from './permissions'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

export default applyMiddleware(makeExecutableSchema({ resolvers, typeDefs }), permissions)
