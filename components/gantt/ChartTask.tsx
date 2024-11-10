import { cn } from '@/lib/utils'
import { Task } from '@/types/task'
import type { ChartDimensions } from '@/lib/visualization-utils'

interface ChartTaskProps {
	task: Task
	index: number
	dimensions: ChartDimensions
	position: {
	  left: number
	  top: number
	  width: number
	}
	showTaskLabels: boolean
	hoveredTaskId: string | null
	selectedTaskId: string | null
	onTaskHover: (taskId: string | null) => void
  }

  export function ChartTask({
	task,
	position,
	dimensions,
	showTaskLabels,
	hoveredTaskId,
	selectedTaskId,
	onTaskHover
  }: ChartTaskProps) {
	const isSelected = task.id === selectedTaskId
	const isHovered = task.id === hoveredTaskId
  
	return (
	  <div
		className={cn(
		  "absolute transition-colors",
		  isSelected && "ring-2 ring-primary",
		  isHovered && "brightness-110"
		)}
		style={{
		  left: position.left,
		  top: position.top,
		  width: position.width,
		  height: dimensions.ROW_HEIGHT - 8
		}}
		onMouseEnter={() => onTaskHover(task.id)}
		onMouseLeave={() => onTaskHover(null)}
	  >
		{showTaskLabels && (
		  <span className="absolute left-2 text-sm font-medium text-foreground">
			{task.name}
		  </span>
		)}
	  </div>
	)
  }
