import React, { Suspense, useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { App } from 'components/Layout'
import UserContext from 'context/UserContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Oauth from './pages/Oauth'
import Page404 from './pages/Page404'

export default function AppRouter() {
	const { user, loading } = useContext(UserContext)

	return (
		<BrowserRouter>
			<App>
				<Suspense fallback="...">
					{!user && loading ? (
						<div>...</div>
					) : (
						<Switch>
							{user ? (
								<>
									<Route path="/" exact>
										<Home />
									</Route>
									<Route path="/logout">
										<Logout />
									</Route>
								</>
							) : (
								<>
									<Route path="/" exact>
										<Login />
									</Route>
									<Route path="/oauth">
										<Oauth />
									</Route>
								</>
							)}
							<Route>
								<Page404 />
							</Route>
						</Switch>
					)}
				</Suspense>
			</App>
		</BrowserRouter>
	)
}
