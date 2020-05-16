import React from 'react'
import { Container } from 'reactstrap'

type State = {
	error?: Error
	errorInfo?: React.ErrorInfo
}

type Props = {
	children?: React.ReactNode
}

export default class ErrorBoundary extends React.Component<Props, State> {
	state: State = {}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		if (process.env.NODE_ENV === 'test') {
			throw error
		}
		this.setState({ error, errorInfo })
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<Container>
					<h2 className="text-danger">
						Something's wrong{' '}
						<span role="img" aria-label="shrug">
							🤷
						</span>
					</h2>
					<details>
						<small>
							<pre className="mt-2">
								{this.state.error && this.state.error.toString()}
								{this.state.errorInfo.componentStack}
							</pre>
						</small>
					</details>
				</Container>
			)
		}

		return this.props.children || null
	}
}
