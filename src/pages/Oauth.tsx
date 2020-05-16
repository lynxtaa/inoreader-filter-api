import React, { useEffect, useContext } from 'react'
import { Page } from 'components/Layout'
import { Container } from 'reactstrap'
import { useLocation } from 'react-router-dom'
import gql from 'utils/gql'
import { useMutation } from 'graphql-hooks'
import { authorize as authorizeType, authorizeVariables } from 'gql/queries'
import UserContext from 'context/UserContext'

const AUTHORIZE = gql`
	mutation authorize($authCode: String!) {
		authorize(authCode: $authCode)
	}
`

export default function Oauth() {
	const location = useLocation()
	const { refetch } = useContext(UserContext)

	const [authorize] = useMutation<authorizeType, authorizeVariables>(AUTHORIZE)

	const searchParams = new URLSearchParams(location.search)
	const authCode = searchParams.get('code')
	const csrfToken = searchParams.get('state')

	useEffect(() => {
		if (!authCode) {
			alert('No auth code!')
			return
		}

		const savedCsrfToken = localStorage.getItem('csrfToken')
		if (savedCsrfToken !== csrfToken) {
			alert('Wrong csrf token')
			return
		}

		authorize({ variables: { authCode } }).then(
			({ error }) => !error && refetch(),
		)
	}, [authCode, authorize, csrfToken, refetch])

	return (
		<Page className="Oauth">
			<Container>Authorizing...</Container>
		</Page>
	)
}
