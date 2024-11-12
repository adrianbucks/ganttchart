import { Task } from "@/types/task"
import { type ChartDimensions, calculateDateXPosition } from "@/lib/visualization-utils"
import { useTasksContext } from '@/hooks/useTasksContext'
import { cn } from '@/lib/utils'

interface ChartDependencyProps {
  fromTask: Task
  toTask: Task
  dimensions: ChartDimensions
}

export function ChartDependency({
  fromTask,
  toTask,
  dimensions,
}: ChartDependencyProps) {
  const { state, getChildTasks } = useTasksContext()
  const { taskHovered, selectedTask, arrowHead } = state
  if (!selectedTask) return null
  const projectTasks = getChildTasks(selectedTask.id)
  const isHovered = taskHovered === fromTask.id || taskHovered === toTask.id

  const getDependencyPath = (fromTask: Task, toTask: Task) => {
    const fromX = calculateDateXPosition(fromTask.endDate, selectedTask.startDate, dimensions)
    const fromY = projectTasks.indexOf(fromTask) * dimensions.ROW_HEIGHT + dimensions.HEADER_HEIGHT + dimensions.ROW_HEIGHT / 2
    const toX = calculateDateXPosition(toTask.startDate, selectedTask.startDate, dimensions)
    const toY = projectTasks.indexOf(toTask) * dimensions.ROW_HEIGHT + dimensions.HEADER_HEIGHT + dimensions.ROW_HEIGHT / 2

    if (arrowHead === 'curved') {
      const midX = (fromX + toX) / 2
      return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
    } else {
      const midY = (fromY + toY) / 2
      return `M ${fromX} ${fromY} H ${fromX + 10} V ${midY} H ${toX - 10} V ${toY} H ${toX}`
    }
  }

  return (
      <path
        d={getDependencyPath(fromTask, toTask)}
        className={cn(
          "fill-none stroke-muted-foreground",
          isHovered ? "stroke-primary stroke-2" : "stroke-1"
        )}
        markerEnd="url(#arrowhead)"
      />
    )
}
