import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	}

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo)
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="p-4 text-center">
					<h2 className="text-xl font-bold text-red-600 mb-2">
						Something went wrong
					</h2>
					<p className="text-muted-foreground mb-4">
						{this.state.error?.message ||
							'An unexpected error occurred'}
					</p>
					<button
						className="px-4 py-2 bg-primary text-white rounded-md"
						onClick={() => this.setState({ hasError: false })}
					>
						Try again
					</button>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
