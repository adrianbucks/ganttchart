import React from 'react'
import { Plus, Minus, RotateCcw } from 'lucide-react'

interface ZoomControlsProps {
	onZoomIn: () => void
	onZoomOut: () => void
	onReset: () => void
}

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
	return (
		<div className="flex gap-2 p-2 bg-background rounded-lg shadow-sm">
			<button
				onClick={onZoomIn}
				className="p-1 hover:bg-muted rounded"
				aria-label="Zoom in"
			>
				<Plus size={16} />
			</button>
			<button
				onClick={onZoomOut}
				className="p-1 hover:bg-muted rounded"
				aria-label="Zoom out"
			>
				<Minus size={16} />
			</button>
			<button
				onClick={onReset}
				className="p-1 hover:bg-muted rounded"
				aria-label="Reset zoom"
			>
				<RotateCcw size={16} />
			</button>
		</div>
	)
}

export default ZoomControls
