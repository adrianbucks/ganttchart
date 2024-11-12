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
	granularity = 'day',
	className,
}: GanttChartProps) {
	const { dayWidth, zoomIn, zoomOut, reset, disabled } = useChartZoom()
	const { state, getChildTasks, setArrowHead } = useTasksContext()

	const selectedProject = state.selectedTask
	if (!selectedProject || selectedProject.type !== 'project') return null

	const projectTasks = getChildTasks(selectedProject.id)
	const { arrowHead } = state

	const dimensions = calculateChartDimensions(
		projectTasks,
		dayWidth,
		selectedProject.startDate,
		selectedProject.endDate
	)

	const dates = generateTimelineDates(
		selectedProject.startDate,
		selectedProject.endDate
	)

	return (
		<TooltipProvider>
			<div className={cn('space-y-4', className)}>
				<ChartControls
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onReset={reset}
					onGranularityChange={() => {}}
					onTimeframeChange={() => {}}
					onArrowStyleToggle={() =>
						setArrowHead(
							arrowHead === 'curved' ? 'squared' : 'curved'
						)
					}
					granularity={granularity}
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
									key={task.id}
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
										key={`${depId}-${task.id}`}
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
