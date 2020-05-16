import cn from 'classnames'
import React from 'react'

import ErrorBoundary from 'components/ErrorBoundary'

import './Page.css'

type Props = {
	children?: React.ReactNode
	className?: string
}

export default function Page({ children, className }: Props) {
	return (
		<div className={cn('Page', className)}>
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	)
}
