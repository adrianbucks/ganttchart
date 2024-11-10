import { Task } from "@/types/task"
import { type ChartDimensions, calculateTaskPosition, generateDependencyPath } from "@/lib/visualization-utils"

interface ChartDependencyProps {
  task: Task
  tasks: Task[]
  dimensions: ChartDimensions
  arrowStyle: 'curved' | 'squared'
}

export function ChartDependency({
  task,
  tasks,
  dimensions,
  arrowStyle
}: ChartDependencyProps) {
  if (!task.dependencies?.length) return null

  return (
    <>
      {task.dependencies.map(depId => {
        const dependencyTask = tasks.find(t => t.id === depId)
        if (!dependencyTask) return null

        const startPosition = calculateTaskPosition(dependencyTask, tasks.indexOf(dependencyTask), dimensions, task.startDate)
        const endPosition = calculateTaskPosition(task, tasks.indexOf(task), dimensions, task.startDate)

        return (
          <svg
            key={`${task.id}-${depId}`}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: dimensions.CHART_WIDTH,
              height: dimensions.CHART_HEIGHT
            }}
          >
            <path
              d={generateDependencyPath(startPosition, endPosition, arrowStyle)}
              className="stroke-muted-foreground"
              fill="none"
              strokeWidth={1}
            />
          </svg>
        )
      })}
    </>
  )
}
