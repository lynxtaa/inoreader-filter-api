import { useQuery } from 'graphql-hooks'
import React, { createContext } from 'react'

import gql from 'utils/gql'
import { me } from 'gql/queries'

const ME = gql`
	query me {
		me {
			_id
			name
			rules {
				_id
				createdAt
				isActive
				lastHitAt
				hits
				rule {
					prop
					type
					negate
					value
				}
			}
		}
	}
`

const UserContext = createContext<{
	user: me['me']
	loading: boolean
	refetch: () => void
}>({ user: null, loading: true, refetch: () => {} })

export default UserContext

type Props = {
	children: React.ReactNode
}

export function UserProvider({ children }: Props) {
	const { data, loading, refetch } = useQuery<me>(ME)

	return (
		<UserContext.Provider
			value={{ user: data ? data.me : null, loading, refetch }}
		>
			{children}
		</UserContext.Provider>
	)
}
