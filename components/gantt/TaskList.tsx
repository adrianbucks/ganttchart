'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { Project, Task } from '@/types/project'
import { useState } from 'react'
import { TaskFormModal } from './TaskFormModal'
import { ConfirmationModal } from '@/components/gantt/ConfirmationModal'
import { useTasks } from '@/hooks/useTasks'

interface TaskListProps {
	project: Project
}
export function TaskList({ project }: TaskListProps) {
	const { filteredTasks, deleteTask } = useTasks(project)
	const [editingTask, setEditingTask] = useState<Task | null>(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)

	const handleEditClick = (task: Task) => {
		setEditingTask(task)
		setIsEditModalOpen(true)
	}

	return (
		<>
			<div className="space-y-2">
				{filteredTasks.map((task) => (
					<div
						key={task.id}
						className="flex items-center justify-between p-3 border rounded-md"
					>
						<div>
							<h3 className="font-medium">{task.name}</h3>
							{task.description && (
								<p className="text-sm text-muted-foreground mt-1">
									{task.description}
								</p>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleEditClick(task)}
							>
								<Edit2 className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setDeleteTaskId(task.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}

				{editingTask && (
					<TaskFormModal
						open={isEditModalOpen}
						onOpenChange={(open) => {
							setIsEditModalOpen(open)
							if (!open) setEditingTask(null)
						}}
						task={editingTask}
						onTaskChange={setEditingTask}
						mode="edit"
						project={project}
					/>
				)}
			</div>
			<ConfirmationModal
				open={!!deleteTaskId}
				onOpenChange={(open) => !open && setDeleteTaskId(null)}
				onConfirm={() => {
					if (deleteTaskId) {
						deleteTask(deleteTaskId)
						setDeleteTaskId(null)
					}
				}}
				title="Delete Task"
				description="Are you sure you want to delete this task? This action cannot be undone."
			/>
		</>
	)
}
