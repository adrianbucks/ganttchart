import { useState, useCallback, useMemo } from 'react'
import { Task, Project } from '@/types/project'
import { toast } from '@/hooks/use-toast'
import { useProjects } from '@/hooks/useProjects'

export function useTasks(project: Project) {
	const { updateProject } = useProjects()
	const [loading, setLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [filter, setFilter] = useState('all')
	const [showCompleted, setShowCompleted] = useState(true)

	const tasks = project.tasks

	const calculateDates = useCallback(
		(taskList: Task[], newTask?: Task) => {
			const updatedTasks = [...taskList]
			if (newTask) {
				updatedTasks.push(newTask)
			}

			// First pass: Calculate dates for tasks without dependencies
			updatedTasks.forEach((task) => {
				if (task.dependencies?.length === 0) {
					if (!task.startDate) {
						task.startDate = project.startDate
					}
					if (!task.endDate && task.duration) {
						task.endDate =
							task.startDate + task.duration * 24 * 60 * 60 * 1000
					}
				}
			})

			// Second pass: Calculate dates for tasks with dependencies
			let changed = true
			while (changed) {
				changed = false
				updatedTasks.forEach((task) => {
					if (task.dependencies?.length ?? 0 > 0) {
						const maxEndDate = Math.max(
							...(task.dependencies ?? []).map((depId) => {
								const depTask = updatedTasks.find(
									(t) => t.id === depId
								)
								return depTask ? depTask.endDate : 0
							})
						)

						const newStartDate = maxEndDate
						if (task.startDate !== newStartDate) {
							changed = true
							task.startDate = newStartDate
							task.endDate =
								newStartDate +
								(task.duration ?? 0) * 24 * 60 * 60 * 1000
						}
					}
				})
			}

			return updatedTasks
		},
		[project.startDate]
	)

	const validateDependencies = useCallback(
		(tasks: Task[], newTask?: Task): boolean => {
			const visited = new Set<string>()
			const visiting = new Set<string>()

			const hasCycle = (taskId: string): boolean => {
				if (visiting.has(taskId)) return true
				if (visited.has(taskId)) return false

				visiting.add(taskId)
				const task = tasks.find((t) => t.id === taskId)

				if (task?.dependencies) {
					for (const depId of task.dependencies) {
						if (hasCycle(depId)) return true
					}
				}

				visiting.delete(taskId)
				visited.add(taskId)
				return false
			}

			const allTasks = newTask ? [...tasks, newTask] : tasks
			return !allTasks.some((task) => hasCycle(task.id))
		},
		[]
	)

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchesSearch = task.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
			if (!matchesSearch) return false

			if (!showCompleted && task.progress === 100) return false

			switch (filter) {
				case 'inProgress':
					return task.progress > 0 && task.progress < 100
				case 'completed':
					return task.progress === 100
				case 'upcoming':
					return task.progress === 0
				default:
					return true
			}
		})
	}, [tasks, searchTerm, filter, showCompleted])

	const addTask = useCallback(
		async (newTask: Task) => {
			try {
				setLoading(true)
				if (!validateDependencies(tasks, newTask)) {
					toast({
						variant: 'destructive',
						description: 'Circular dependency detected',
					})
					return
				}

				const updatedTasks = calculateDates([...tasks, newTask])
				await updateProject({ ...project, tasks: updatedTasks })
				toast({ description: 'Task added successfully' })
			} catch (error) {
				console.log(error)
				toast({
					variant: 'destructive',
					description: 'Failed to add task',
				})
			} finally {
				setLoading(false)
			}
		},
		[tasks, calculateDates, validateDependencies, updateProject, project]
	)

	const updateTask = useCallback(
		async (updatedTask: Task) => {
			try {
				setLoading(true)
				const updatedTaskWithDates = {
					...updatedTask,
					endDate:
						updatedTask.startDate +
						(updatedTask.duration ?? 0) * 24 * 60 * 60 * 1000,
				}

				const recalculatedTasks = calculateDates(
					tasks.map((task) =>
						task.id === updatedTask.id ? updatedTaskWithDates : task
					)
				)
				await updateProject({ ...project, tasks: recalculatedTasks })
				toast({ description: 'Task updated successfully' })
			} catch (error) {
				console.log(error)
				toast({
					variant: 'destructive',
					description: 'Failed to update task',
				})
			} finally {
				setLoading(false)
			}
		},
		[tasks, calculateDates, updateProject, project]
	)

	const deleteTask = useCallback(
		async (taskId: string) => {
			try {
				setLoading(true)
				const updatedTasks = tasks.filter((task) => task.id !== taskId)
				// Also remove this task from other tasks' dependencies
				updatedTasks.forEach((task) => {
					task.dependencies = (task.dependencies ?? []).filter(
						(depId) => depId !== taskId
					)
				})
				await updateProject({ ...project, tasks: updatedTasks })
				toast({ description: 'Task deleted successfully' })
			} catch (error) {
				console.log(error)
				toast({
					variant: 'destructive',
					description: 'Failed to delete task',
				})
			} finally {
				setLoading(false)
			}
		},
		[tasks, project, updateProject]
	)

	return {
		tasks,
		filteredTasks,
		loading,
		searchTerm,
		filter,
		showCompleted,
		setSearchTerm,
		setFilter,
		setShowCompleted,
		addTask,
		updateTask,
		deleteTask,
	}
}
