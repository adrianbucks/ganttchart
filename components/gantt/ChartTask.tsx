import { cn } from '@/lib/utils'
import { Task } from '@/types/task'
import { ChartDimensions, calculateDateXPosition } from '@/lib/visualization-utils'
import { useTasksContext } from '@/hooks/useTasksContext'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { format, differenceInDays } from 'date-fns'

interface ChartTaskProps {
	task: Task
	dimensions: ChartDimensions
	showTaskLabels: boolean
  }

  export function ChartTask({
	task,
	dimensions,
	showTaskLabels,
  }: ChartTaskProps) {
	const { state, setTaskToAction, setTaskHovered, getChildTasks } = useTasksContext()
	const { selectedTask } = state
	if (!task || !selectedTask) return null
	const taskStart = calculateDateXPosition(task.startDate, (selectedTask?.startDate || Date.now()), dimensions)
	const taskEnd = calculateDateXPosition(task.endDate, (selectedTask?.startDate || Date.now()), dimensions)
	const taskWidth = taskEnd - taskStart
	const projectTasks = getChildTasks(selectedTask.id)
	const y = dimensions.HEADER_HEIGHT + projectTasks.indexOf(task) * dimensions.ROW_HEIGHT
	const isSelected = state.taskToAction?.id === task.id
	const isHovered = state.taskHovered === task.id
  
	return (
		<g
		  onMouseEnter={() => setTaskHovered(task.id)}
		  onMouseLeave={() => setTaskHovered('0')}
		  onClick={() => setTaskToAction(task)}
		>
		  {showTaskLabels && (
			<text
			  x={dimensions.LABEL_WIDTH - 8}
			  y={y + dimensions.ROW_HEIGHT / 2}
			  className={cn(
				"fill-foreground",
				isSelected && "font-bold"
			  )}
			  textAnchor="end"
			  dominantBaseline="middle"
			>
			  {task.name}
			</text>
		  )}
	
		  <Tooltip>
			<TooltipTrigger asChild>
			  <g>
				<rect
				  x={taskStart}
				  y={y + dimensions.ROW_HEIGHT / 4}
				  width={taskWidth}
				  height={dimensions.ROW_HEIGHT / 2}
				  rx={4}
				  className={cn(
					"fill-muted transition-colors",
					isHovered && "fill-muted/80",
					isSelected && "stroke-primary stroke-2"
				  )}
				/>
	
				<rect
				  x={taskStart}
				  y={y + dimensions.ROW_HEIGHT / 4}
				  width={taskWidth * (task.progress / 100)}
				  height={dimensions.ROW_HEIGHT / 2}
				  rx={4}
				  fill={task?.visualSettings?.color || "hsl(var(--primary))"}
				  className={cn(
					"transition-colors",
					isHovered && "opacity-80"
				  )}
				/>
	
				{task.slack && task.slack > 0 && (
				  <rect
					x={taskEnd}
					y={y + dimensions.ROW_HEIGHT / 4}
					width={task.slack * (taskEnd - taskStart) / differenceInDays(task.endDate, task.startDate)}
					height={dimensions.ROW_HEIGHT / 2}
					rx={4}
					className="fill-primary/20"
					strokeDasharray="4 4"
				  />
				)}
			  </g>
			</TooltipTrigger>
			<TooltipContent>
			  <p>{task.name}</p>
			  <p>Progress: {task.progress}%</p>
			  <p>Start: {format(task.startDate, 'MMM d, yyyy')}</p>
			  <p>End: {format(task.endDate, 'MMM d, yyyy')}</p>
			</TooltipContent>
		  </Tooltip>
		</g>
	  )
  }
