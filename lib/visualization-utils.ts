import { Task } from "@/types/task"
import { addDays, differenceInDays, isWithinInterval } from "date-fns"

// Transform tasks for network diagram visualization
export function prepareNetworkData(tasks: Task[]) {
  const nodes = tasks.map(task => ({
    id: task.id,
    label: task.name,
    progress: task.progress,
    type: task.type,
    color: task.color || "hsl(var(--primary))"
  }))

  const edges = tasks.reduce((acc, task) => {
    if (task.dependencies) {
      const connections = task.dependencies.map(depId => ({
        from: depId,
        to: task.id,
        type: task.type
      }))
      return [...acc, ...connections]
    }
    return acc
  }, [] as any[])

  return { nodes, edges }
}

// Transform tasks for timeline visualization
export function prepareTimelineData(tasks: Task[], startDate: Date, endDate: Date) {
  const timelineRange = differenceInDays(endDate, startDate) + 1
  const timeSlots = Array.from({ length: timelineRange }, (_, i) => 
    addDays(startDate, i)
  )

  return timeSlots.map(date => ({
    date,
    tasks: tasks.filter(task => 
      isWithinInterval(date, { start: task.startDate, end: task.endDate })
    )
  }))
}

// Transform tasks for kanban visualization
export function prepareKanbanData(tasks: Task[]) {
  return {
    todo: tasks.filter(t => t.progress === 0),
    inProgress: tasks.filter(t => t.progress > 0 && t.progress < 100),
    completed: tasks.filter(t => t.progress === 100)
  }
}

// Calculate critical path
export function calculateCriticalPath(tasks: Task[]) {
  const graph = tasks.reduce((acc, task) => {
    acc[task.id] = task.dependencies || []
    return acc
  }, {} as Record<string, string[]>)

  const visited = new Set<string>()
  const path: string[] = []

  function dfs(taskId: string) {
    if (visited.has(taskId)) return
    visited.add(taskId)
    
    const dependencies = graph[taskId] || []
    dependencies.forEach(dfs)
    path.push(taskId)
  }

  Object.keys(graph).forEach(dfs)
  return path
}

// Calculate task metrics
export function calculateTaskMetrics(tasks: Task[]) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.progress === 100).length
  const overallProgress = Math.round(
    tasks.reduce((acc, task) => acc + task.progress, 0) / totalTasks
  )

  return {
    totalTasks,
    completedTasks,
    overallProgress,
    criticalPath: calculateCriticalPath(tasks)
  }
}
