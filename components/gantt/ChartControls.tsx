import { Button } from '@/components/ui/button'
import { ZoomControls } from './ZoomControls'
import {
	ArrowLeftRight,
	Calendar,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTasksContext } from '@/hooks/useTasksContext'

interface ChartControlsProps {
	onZoomIn: () => void
	onZoomOut: () => void
	onReset: () => void
	onArrowStyleToggle: () => void
	onTimeframeChange: (direction: 'prev' | 'next') => void
	arrowStyle: 'curved' | 'squared'
	zoomDisabled: {
		zoomIn?: boolean
		zoomOut?: boolean
		reset?: boolean
	}
	className?: string
}

export function ChartControls({
	onZoomIn,
	onZoomOut,
	onReset,
	onArrowStyleToggle,
	onTimeframeChange,
	arrowStyle,
	zoomDisabled,
	className,
}: ChartControlsProps) {
	const { state, setGranularity } = useTasksContext()
	const { granularity } = state
	return (
		<div className={cn('flex items-center justify-between p-2', className)}>
			<div className="flex items-center gap-4">
				<ZoomControls
					onZoomIn={onZoomIn}
					onZoomOut={onZoomOut}
					onReset={onReset}
					disabled={zoomDisabled}
				/>

				<div className="flex items-center gap-2 border-l pl-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onTimeframeChange('prev')}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onTimeframeChange('next')}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant={arrowStyle === 'curved' ? 'default' : 'outline'}
					size="sm"
					onClick={onArrowStyleToggle}
				>
					<ArrowLeftRight className="h-4 w-4 mr-2" />
					{arrowStyle === 'curved' ? 'Curved' : 'Squared'}
				</Button>

				<div className="flex items-center rounded-md border">
					{(['day', 'week', 'month'] as const).map((view) => (
						<Button
							key={`granularity-${view}`}
							variant={granularity === view ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setGranularity(view)}
							className="capitalize"
						>
							<Calendar className="h-4 w-4 mr-2" />
							{view}
						</Button>
					))}
				</div>
			</div>
		</div>
	)
}
