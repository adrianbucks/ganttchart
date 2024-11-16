import { useChartZoom } from '@/hooks/useChartZoom'
import { ChartHeader } from './ChartHeader'
import { ChartGrid } from './ChartGrid'
import { ChartTask } from './ChartTask'
import { ChartDependency } from './ChartDependency'
import { ChartControls } from './ChartControls'
import { ChartScrollContainer } from './ChartScrollContainer'
import { useTasksContext } from '@/hooks/useTasksContext'
import {
	calculateChartDimensions,
	generateTimelineDates,
	type ChartSettings,
} from '@/lib/visualization-utils'
import { TooltipProvider } from '../ui/tooltip'
import { cn } from '@/lib/utils'

interface GanttChartProps extends Partial<ChartSettings> {
	className?: string
}

export function GanttChart({
	showTaskLabels = true,
	className,
}: GanttChartProps) {
	
	const { state, getChildTasks, setArrowHead } = useTasksContext()
	const { selectedTask, granularity } = state
	const { dayWidth, zoomIn, zoomOut, reset, disabled } = useChartZoom(granularity)
	
	if (!selectedTask || selectedTask.type !== 'project') return null

	const projectTasks = getChildTasks(selectedTask.id)
	const { arrowHead } = state

	const dimensions = calculateChartDimensions(
		projectTasks,
		dayWidth,
		selectedTask.startDate,
		selectedTask.endDate,
	)

	const dates = generateTimelineDates(
		selectedTask.startDate,
		selectedTask.endDate,
		granularity
	)

	return (
		<TooltipProvider>
			<div className={cn('space-y-4', className)}>
				<ChartControls
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onReset={reset}
					onTimeframeChange={() => {}}
					onArrowStyleToggle={() =>
						setArrowHead(
							arrowHead === 'curved' ? 'squared' : 'curved'
						)
					}
					arrowStyle={arrowHead}
					zoomDisabled={disabled}
				/>

				<ChartScrollContainer dimensions={dimensions}>
					<svg
						width={dimensions.CHART_WIDTH}
						height={dimensions.CHART_HEIGHT}
					>
						<ChartHeader
							dates={dates}
							granularity={granularity}
							dimensions={dimensions}
						/>

						<ChartGrid
							dates={dates}
							dimensions={dimensions}
							granularity={granularity}
						/>

						{projectTasks.map((task) => {
							return (
								<ChartTask
									key={`${task.id}-${granularity}`}
									task={task}
									dimensions={dimensions}
									showTaskLabels={showTaskLabels}
								/>
							)
						})}

						{projectTasks.map((task) =>
							task.dependencies?.map((depId) => {
								const fromTask = projectTasks.find(
									(t) => t.id === depId
								)
								if (!fromTask) return null

								return (
									<ChartDependency
										key={`dependency-${task.id}-to-${depId}-${granularity}`}
										fromTask={fromTask}
										toTask={task}
										dimensions={dimensions}
									/>
								)
							})
						)}
						<defs>
							<marker
								id="arrowhead"
								markerWidth="10"
								markerHeight="7"
								refX="9"
								refY="3.5"
								orient="auto"
							>
								<polygon
									points="0 0, 10 3.5, 0 7"
									className="fill-muted-foreground"
								/>
							</marker>
						</defs>
					</svg>
				</ChartScrollContainer>
			</div>
		</TooltipProvider>
	)
}
