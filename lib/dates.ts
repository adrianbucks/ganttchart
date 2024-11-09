import { Task } from '@/types/task'
import { addDays, differenceInDays } from 'date-fns'

export function calculateDates(
	tasks: Task[],
	projectId: string,
	newStartDate?: number
) {
	const project = tasks.find(
		(t) => t.id === projectId && t.type === 'project'
	)
	if (!project) return tasks

	const updatedTasks = [...tasks]

	if (newStartDate !== undefined) {
		project.startDate = newStartDate
	}

	const projectTasks = tasks.filter((t) => t.parentTask === projectId)
	const sortedTasks = sortTasksByDependencies(projectTasks)

	sortedTasks.forEach((task) => {
		const taskIndex = updatedTasks.findIndex((t) => t.id === task.id)
		if (taskIndex === -1) return

		let startDate = project.startDate

		if ((task.dependencies || [])?.length > 0) {
			const dependencyEndDates = (task.dependencies || []).map(
				(depId) => {
					const dep = updatedTasks.find((t) => t.id === depId)
					return dep ? dep.endDate : project.startDate
				}
			)
			startDate = Math.max(...dependencyEndDates)
		}

		const duration = task.type === 'milestone' ? 0 : task.duration
		const endDate = addDays(new Date(startDate), duration || 1).getTime()

		updatedTasks[taskIndex] = {
			...updatedTasks[taskIndex],
			startDate,
			endDate,
		}
	})

	const lastTaskEnd = Math.max(...projectTasks.map((task) => task.endDate))
	const projectIndex = updatedTasks.findIndex((t) => t.id === projectId)

	updatedTasks[projectIndex] = {
		...updatedTasks[projectIndex],
		endDate: lastTaskEnd,
		duration: differenceInDays(
			new Date(lastTaskEnd),
			new Date(project.startDate)
		),
	}

	return updatedTasks
}

function sortTasksByDependencies(tasks: Task[]): Task[] {
	const sorted: Task[] = []
	const visited = new Set<string>()

	function visit(task: Task) {
		if (visited.has(task.id)) return

		if (task.dependencies) {
			task.dependencies.forEach((depId) => {
				const depTask = tasks.find((t) => t.id === depId)
				if (depTask) visit(depTask)
			})
		}

		visited.add(task.id)
		sorted.push(task)
	}

	tasks.forEach((task) => visit(task))
	return sorted
}
