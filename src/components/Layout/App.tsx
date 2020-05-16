import React from 'react'
import ErrorBoundary from 'components/ErrorBoundary'

import './App.css'

type Props = {
	children?: React.ReactNode
}

export default function App({ children }: Props) {
	return (
		<div className="App w-100">
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	)
}
