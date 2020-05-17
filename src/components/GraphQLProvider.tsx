import { GraphQLClient, ClientContext } from 'graphql-hooks'
import React, { useMemo } from 'react'

import fetchWithAuth from 'utils/fetchWithAuth'

type Props = {
	children: React.ReactNode
	url?: string
}

export default function GraphQLProvider({ url = '/graphql', children }: Props) {
	const client = useMemo(
		() =>
			new GraphQLClient({
				url,
				fetch: fetchWithAuth,
				onError: ({ operation, result }) => {
					const { graphQLErrors, httpError, fetchError } = result.error!
					const message =
						graphQLErrors && graphQLErrors.length > 0
							? (graphQLErrors[0] as any).message
							: httpError
							? `error ${httpError.status}\n\n${httpError.body}`
							: fetchError!.message

					// TODO: сделать лучше
					alert(message)
				},
			}),
		[url],
	)

	return (
		<ClientContext.Provider value={client}>{children}</ClientContext.Provider>
	)
}
