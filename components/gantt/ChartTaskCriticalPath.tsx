import { Task } from "@/types/task"
import { cn } from "@/lib/utils"

interface ChartTaskCriticalPathProps {
  tasks: Task[]
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
    DAY_WIDTH: number
  }
  startDate: Date
  className?: string
}

export function ChartTaskCriticalPath({
  tasks,
  dimensions,
  startDate,
  className
}: ChartTaskCriticalPathProps) {
  const criticalPath = calculateCriticalPath(tasks)

  const getTaskPosition = (task: Task) => {
    const days = Math.floor((task.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const x = dimensions.LABEL_WIDTH + (days * dimensions.DAY_WIDTH)
    const y = dimensions.HEADER_HEIGHT + (tasks.indexOf(task) * dimensions.ROW_HEIGHT) + (dimensions.ROW_HEIGHT / 2)
    return { x, y }
  }

  return (
    <svg className={cn("absolute inset-0 pointer-events-none", className)}>
      {criticalPath.map((taskId, index) => {
        if (index === criticalPath.length - 1) return null

        const currentTask = tasks.find(t => t.id === taskId)
        const nextTask = tasks.find(t => t.id === criticalPath[index + 1])

        if (!currentTask || !nextTask) return null

        const start = getTaskPosition(currentTask)
        const end = getTaskPosition(nextTask)

        return (
          <g key={`${currentTask.id}-${nextTask.id}`}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="stroke-destructive stroke-2"
              strokeDasharray="4 4"
            />
          </g>
        )
      })}
    </svg>
  )
}

function calculateCriticalPath(tasks: Task[]): string[] {
  // Implementation of critical path calculation algorithm
  // This is a simplified version - you might want to implement
  // a more sophisticated algorithm based on your needs
  const path: string[] = []
  const endTasks = tasks.filter(task => 
    !tasks.some(t => t.dependencies?.includes(task.id))
  )

  if (endTasks.length === 0) return path

  const longestPath = endTasks.reduce((acc, task) => {
    const pathFromTask = findLongestPath(task, tasks)
    return pathFromTask.length > acc.length ? pathFromTask : acc
  }, [] as string[])

  return longestPath
}

function findLongestPath(task: Task, allTasks: Task[]): string[] {
  if (!task.dependencies || task.dependencies.length === 0) {
    return [task.id]
  }

  return task.dependencies.reduce((acc, depId) => {
    const depTask = allTasks.find(t => t.id === depId)
    if (!depTask) return acc

    const pathFromDep = findLongestPath(depTask, allTasks)
    return pathFromDep.length > acc.length ? [...pathFromDep, task.id] : acc
  }, [] as string[])
}
