'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { TimeScale } from './TimeScale'
import { TaskBar } from './TaskBar'
import { DependencyArrow } from './DependencyArrow'
import { TaskFormModal } from './TaskFormModal'
import { TaskList } from './TaskList'
import { Project, Task } from '@/types/project'
import { useProjects } from '@/hooks/useProjects'
import ZoomControls from './ZoomControls'
import TaskFilter from './TaskFilter'
import LoadingSpinner from '@/components/gantt/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ProjectDetails } from './ProjectDetails'
import { useTasks } from '@/hooks/useTasks'

interface GanttChartProps {
	project: Project
}

export default function GanttChart({ project }: GanttChartProps) {
	const { updateProject } = useProjects()
	const { tasks, filteredTasks, loading, showCompleted, setShowCompleted } =
		useTasks(project)

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
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

	const taskHeight = 40

	// Calculate chart dimensions
	const totalDuration = Math.max(
		...filteredTasks.map((task) =>
			Math.ceil(
				(task.endDate - project.startDate) / (1000 * 60 * 60 * 24)
			)
		),
		30
	)

	const chartWidth = (totalDuration + 1) * dayWidth

	const handleZoomIn = () => setDayWidth((prev) => Math.min(prev + 10, 100))
	const handleZoomOut = () => setDayWidth((prev) => Math.max(prev - 10, 20))
	const handleZoomReset = () => setDayWidth(40)

	if (loading) return <LoadingSpinner />

	return (
		<>
			<div className="sticky top-0 z-10 bg-background p-4 border-b">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold">
								{project.name}
							</h1>
							<ProjectDetails
								project={project}
								onUpdate={updateProject}
								variant="compact"
							/>
						</div>
						<div className="flex items-center gap-4">
							<TaskFormModal
								open={isTaskModalOpen}
								onOpenChange={setIsTaskModalOpen}
								project={project}
								task={newTask}
								onTaskChange={setNewTask}
								mode="add"
							/>
							<ZoomControls
								onZoomIn={handleZoomIn}
								onZoomOut={handleZoomOut}
								onReset={handleZoomReset}
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<TaskFilter project={project} />
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
					<div className="mt-8">
						<TaskList project={project} />
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
												const depTask = tasks.find(
													(t) => t.id === depId
												)
												if (depTask) {
													const depIndex =
														tasks.findIndex(
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
		</>
	)
}
