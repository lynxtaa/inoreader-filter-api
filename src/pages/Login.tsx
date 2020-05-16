import React from 'react'
import { Page } from 'components/Layout'
import { Container, Button } from 'reactstrap'

export default function Login() {
	function handleAuth() {
		const csrfToken = String(Math.random())
		localStorage.setItem('csrfToken', csrfToken)

		const url = new URL('https://www.inoreader.com/oauth2/auth')
		url.searchParams.append('client_id', process.env.REACT_APP_CLIENT_ID!)
		url.searchParams.append('redirect_uri', `${window.location.origin}/oauth`)
		url.searchParams.append('response_type', 'code')
		url.searchParams.append('scope', 'read write')
		url.searchParams.append('state', csrfToken)

		window.location.href = url.toString()
	}

	return (
		<Page className="Login">
			<Container>
				<h1>Login</h1>
				<Button color="primary" onClick={handleAuth}>
					Login with Inoreader
				</Button>
			</Container>
		</Page>
	)
}
