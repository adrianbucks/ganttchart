import { Task } from '@/types/task'
import { addDays, differenceInDays, isWithinInterval } from 'date-fns'

export interface Edge {
	from: string
	to: string
	type: string
}

export interface PathPosition {
	left: number
	top: number
	width: number
  }

export interface ChartDimensions {
	CHART_HEIGHT: number
	HEADER_HEIGHT: number
	ROW_HEIGHT: number
	LABEL_WIDTH: number
	DAY_WIDTH: number
	CHART_WIDTH: number
  }

  export interface ChartSettings {
	showTaskLabels: boolean
	granularity: 'day' | 'week' | 'month'
	arrowStyle: 'curved' | 'squared'
  }

  export function calculateDateXPosition(
	date: Date,
	startDate: Date,
	dimensions: ChartDimensions
  ): number {
	const diffTime = Math.abs(date.getTime() - startDate.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return dimensions.LABEL_WIDTH + (diffDays * dimensions.DAY_WIDTH)
  }

  export function generateDependencyPath(
	start: PathPosition,
	end: PathPosition,
	style: 'curved' | 'squared'
  ): string {
	const startX = start.left + start.width
	const startY = start.top + start.width / 2
	const endX = end.left
	const endY = end.top + end.width / 2
	const controlPointOffset = 30
  
	if (style === 'curved') {
	  return `M ${startX} ${startY} 
			  C ${startX + controlPointOffset} ${startY},
				${endX - controlPointOffset} ${endY},
				${endX} ${endY}`
	}
  
	return `M ${startX} ${startY}
			L ${startX + controlPointOffset} ${startY}
			L ${startX + controlPointOffset} ${endY}
			L ${endX} ${endY}`
  }

  export function calculateChartDimensions(
	tasks: Task[],
	dayWidth: number,
	startDate: number,
	endDate: number
  ): ChartDimensions {
	return {
	  CHART_HEIGHT: tasks.length * 40 + 100,
	  HEADER_HEIGHT: 80,
	  ROW_HEIGHT: 40,
	  LABEL_WIDTH: 200,
	  DAY_WIDTH: dayWidth,
	  CHART_WIDTH: differenceInDays(new Date(endDate), new Date(startDate)) * dayWidth + 200
	}
  }

  export function calculateTaskPosition(
	task: Task,
	index: number,
	dimensions: ChartDimensions,
	projectStartDate: number
  ): { left: number; top: number; width: number } {
	const dayOffset = differenceInDays(new Date(task.startDate), new Date(projectStartDate))
	const taskDuration = differenceInDays(new Date(task.endDate), new Date(task.startDate))
	
	return {
	  left: dimensions.LABEL_WIDTH + dayOffset * dimensions.DAY_WIDTH,
	  top: dimensions.HEADER_HEIGHT + index * dimensions.ROW_HEIGHT,
	  width: Math.max(taskDuration * dimensions.DAY_WIDTH, dimensions.DAY_WIDTH)
	}
  }

  export function generateTimelineDates(startDate: number, endDate: number): Date[] {
	const timelineRange = differenceInDays(new Date(endDate), new Date(startDate)) + 1
	return Array.from({ length: timelineRange }, (_, i) => addDays(new Date(startDate), i))
  }

// Transform tasks for network diagram visualization
export function prepareNetworkData(tasks: Task[]) {
	const nodes = tasks.map((task) => ({
		id: task.id,
		label: task.name,
		progress: task.progress,
		type: task.type,
		color: task.visualSettings.color || 'hsl(var(--primary))',
	}))

	const edges = tasks.reduce((acc, task) => {
		if (task.dependencies) {
			const connections = task.dependencies.map((depId) => ({
				from: depId,
				to: task.id,
				type: task.type,
			}))
			return [...acc, ...connections]
		}
		return acc
	}, [] as Edge[])

	return { nodes, edges }
}

// Transform tasks for timeline visualization
export function prepareTimelineData(
	tasks: Task[],
	startDate: number,
	endDate: number
) {
	const timelineRange =
		differenceInDays(new Date(endDate), new Date(startDate)) + 1
	const timeSlots = Array.from({ length: timelineRange }, (_, i) =>
		addDays(startDate, i)
	)

	return timeSlots.map((date) => ({
		date,
		tasks: tasks.filter((task) =>
			isWithinInterval(date, { start: task.startDate, end: task.endDate })
		),
	}))
}

// Transform tasks for kanban visualization
export function prepareKanbanData(tasks: Task[]) {
	return {
		todo: tasks.filter((t) => t.progress === 0),
		inProgress: tasks.filter((t) => t.progress > 0 && t.progress < 100),
		completed: tasks.filter((t) => t.progress === 100),
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
	const completedTasks = tasks.filter((t) => t.progress === 100).length
	const overallProgress = Math.round(
		tasks.reduce((acc, task) => acc + task.progress, 0) / totalTasks
	)

	return {
		totalTasks,
		completedTasks,
		overallProgress,
		criticalPath: calculateCriticalPath(tasks),
	}
}
