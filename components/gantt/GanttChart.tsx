'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { TimeScale } from './TimeScale'
import { TaskBar } from './TaskBar'
import { DependencyArrow } from './DependencyArrow'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { Project, Task } from '@/types/project'
import { useProjects } from '@/hooks/useProjects'
import ZoomControls from './ZoomControls'
import TaskFilter from './TaskFilter'
import LoadingSpinner from '@/components/gantt/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface GanttChartProps {
	project: Project
}

export default function GanttChart({ project }: GanttChartProps) {
	const { updateProject } = useProjects()
	const [newTask, setNewTask] = useState<Task>({
		id: '',
		name: '',
		duration: 0,
		dependencies: [],
		startDate: Date.now(),
		endDate: Date.now(),
		progress: 0,
	})
	const [dayWidth, setDayWidth] = useState(40)
	const [searchTerm, setSearchTerm] = useState('')
	const [filter, setFilter] = useState('all')
	const [loading, setLoading] = useState(false)
	const [isEditing, setIsEditing] = useState<string | null>(null)
	const [showCompleted, setShowCompleted] = useState(true)
	// ... other useState declarations ...

	const taskHeight = 40

	const calculateDates = (taskList: Task[], newTask?: Task) => {
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
	}

	const validateDependencies = (tasks: Task[], newTask?: Task): boolean => {
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
	}

	const handleAddTask = async () => {
		try {
			setLoading(true)
			if (!newTask.name || !newTask.duration) {
				toast({
					variant: 'destructive',
					description: 'Please fill in all required fields',
				})
				return
			}

			const taskToAdd = {
				...newTask,
				id: crypto.randomUUID(),
				startDate: project.startDate,
				endDate:
					project.startDate + newTask.duration * 24 * 60 * 60 * 1000,
				dependencies: newTask.dependencies || [],
				progress: 0,
			}

			if (!validateDependencies(project.tasks, taskToAdd)) {
				toast({
					variant: 'destructive',
					description: 'Circular dependency detected',
				})
				return
			}

			const updatedTasks = calculateDates([...project.tasks, taskToAdd])
			const updatedProject = { ...project, tasks: updatedTasks }
			await updateProject(updatedProject)

			project.tasks = updatedTasks

			toast({ description: 'Task added successfully' })
			setNewTask({
				id: '',
				name: '',
				duration: 0,
				dependencies: [],
				startDate: project.startDate,
				endDate: project.startDate,
				progress: 0,
			})
		} catch (error) {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to add task',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteTask = async (taskId: string) => {
		try {
			setLoading(true)
			const updatedTasks = project.tasks.filter(
				(task) => task.id !== taskId
			)
			// Also remove this task from other tasks' dependencies
			updatedTasks.forEach((task) => {
				task.dependencies = (task.dependencies ?? []).filter(
					(depId) => depId !== taskId
				)
			})

			const updatedProject = { ...project, tasks: updatedTasks }
			await updateProject(updatedProject)

			// Update the project prop directly
			project.tasks = updatedTasks

			toast({ description: 'Task deleted successfully' })
		} catch (error) {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to delete task',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateTask = async (updatedTask: Task) => {
		try {
			setLoading(true)
			// Calculate new endDate based on startDate and duration
			const updatedTaskWithDates = {
				...updatedTask,
				endDate:
					updatedTask.startDate +
					(updatedTask.duration ?? 0) * 24 * 60 * 60 * 1000,
			}

			const updatedTasks = project.tasks.map((task) =>
				task.id === updatedTask.id ? updatedTaskWithDates : task
			)

			const recalculatedTasks = calculateDates(updatedTasks)
			const updatedProject = { ...project, tasks: recalculatedTasks }

			await updateProject(updatedProject)

			// Update the project prop directly
			project.tasks = recalculatedTasks

			toast({ description: 'Task updated successfully' })
		} catch (error) {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Failed to update task',
			})
		} finally {
			setLoading(false)
		}
	}

	const filteredTasks = useMemo(() => {
		return project.tasks.filter((task) => {
			// Search filter
			const matchesSearch = task.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
			if (!matchesSearch) return false

			// Status filter
			if (!showCompleted && task.progress === 100) return false

			// Category filter
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
	}, [project.tasks, searchTerm, filter, showCompleted])

	// Calculate chart dimensions
	const totalDuration = useMemo(() => {
		if (filteredTasks.length === 0) return 30
		return Math.max(
			...filteredTasks.map((task) =>
				Math.ceil(
					(task.endDate - project.startDate) / (1000 * 60 * 60 * 24)
				)
			)
		)
	}, [filteredTasks, project.startDate])

	const chartWidth = (totalDuration + 1) * dayWidth

	const handleZoomIn = () => {
		setDayWidth((prev) => {
			const newWidth = Math.min(prev + 10, 100)
			if (prev === newWidth) {
				toast({ description: 'Maximum zoom level reached' })
			}
			return newWidth
		})
	}

	const handleZoomOut = () => {
		setDayWidth((prev) => {
			const newWidth = Math.max(prev - 10, 20)
			if (prev === newWidth) {
				toast({ description: 'Minimum zoom level reached' })
			}
			return newWidth
		})
	}

	const handleZoomReset = () => setDayWidth(40)

	if (loading) return <LoadingSpinner />

	return (
		<div className="relative">
			<div className="sticky top-0 z-10 bg-background p-4 border-b">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold">{project.name}</h1>
						<ZoomControls
							onZoomIn={handleZoomIn}
							onZoomOut={handleZoomOut}
							onReset={handleZoomReset}
						/>
					</div>

					<div className="flex items-center justify-between">
						<TaskFilter
							searchTerm={searchTerm}
							onSearchChange={setSearchTerm}
							onFilterChange={setFilter}
						/>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowCompleted(!showCompleted)}
							>
								{showCompleted ? 'Hide' : 'Show'} Completed
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="p-4">
				<Card className="p-6">
					<TaskForm
						tasks={project.tasks}
						newTask={newTask}
						onTaskChange={setNewTask}
						onTaskAdd={handleAddTask}
						disabled={loading}
					/>

					<div className="mt-8">
						{filteredTasks.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								No tasks found
							</div>
						) : (
							<div className="space-y-4">
								<TaskList
									tasks={filteredTasks}
									onTaskDelete={handleDeleteTask}
									onTaskUpdate={handleUpdateTask}
									isEditing={isEditing}
									setIsEditing={setIsEditing}
								/>
							</div>
						)}
					</div>

					<div className="mt-8 overflow-x-auto">
						<div className="min-w-full">
							<svg
								width="100%"
								height={filteredTasks.length * taskHeight + 50}
								viewBox={`0 0 ${chartWidth} ${
									filteredTasks.length * taskHeight + 50
								}`}
								preserveAspectRatio="xMinYMin"
								className="bg-white"
							>
								<TimeScale
									totalDuration={totalDuration}
									startDate={project.startDate}
									taskHeight={taskHeight}
									dayWidth={dayWidth}
									tasksCount={filteredTasks.length}
								/>

								{filteredTasks.map((task, index) => {
									const startOffset = Math.ceil(
										(task.startDate - project.startDate) /
											(1000 * 60 * 60 * 24)
									)
									const duration = Math.ceil(
										(task.endDate - task.startDate) /
											(1000 * 60 * 60 * 24)
									)

									return (
										<g key={task.id}>
											<TaskBar
												task={task}
												index={index}
												startOffset={startOffset}
												duration={duration}
												taskHeight={taskHeight}
												dayWidth={dayWidth}
											/>

											{task.dependencies?.map((depId) => {
												const depTask =
													project.tasks.find(
														(t) => t.id === depId
													)
												if (depTask) {
													const depIndex =
														project.tasks.findIndex(
															(t) =>
																t.id === depId
														)
													const depEndX =
														Math.ceil(
															(depTask.endDate -
																project.startDate) /
																(1000 *
																	60 *
																	60 *
																	24)
														) * dayWidth
													const startX =
														startOffset * dayWidth

													return (
														<DependencyArrow
															key={`${depId}-${task.id}`}
															depEndX={depEndX}
															depIndex={depIndex}
															startX={startX}
															index={index}
															taskHeight={
																taskHeight
															}
														/>
													)
												}
												return null
											})}
										</g>
									)
								})}
							</svg>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}
