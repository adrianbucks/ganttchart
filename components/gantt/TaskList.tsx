'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { Task } from '@/types/project'
import { useState } from 'react'
import { TaskFormModal } from './TaskFormModal'
import { ConfirmationModal } from '@/components/gantt/ConfirmationModal'

interface TaskListProps {
	tasks: Task[]
	onTaskDelete: (taskId: string) => void
	onTaskUpdate: (task: Task) => void
	isEditing: string | null
	setIsEditing: (id: string | null) => void
}

export function TaskList({ tasks, onTaskDelete, onTaskUpdate }: TaskListProps) {
	const [editingTask, setEditingTask] = useState<Task | null>(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)

	const handleEditClick = (task: Task) => {
		setEditingTask(task)
		setIsEditModalOpen(true)
	}

	const handleDeleteClick = (taskId: string) => {
		setDeleteTaskId(taskId)
	}

	const handleConfirmDelete = () => {
		if (deleteTaskId) {
			onTaskDelete(deleteTaskId)
			setDeleteTaskId(null)
		}
	}

	return (
		<>
			<div className="space-y-2">
				{tasks.map((task) => (
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
								onClick={() => onTaskDelete(task.id)}
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
						tasks={tasks}
						task={editingTask}
						onTaskChange={setEditingTask}
						onTaskSubmit={() => {
							onTaskUpdate(editingTask)
							setIsEditModalOpen(false)
							setEditingTask(null)
						}}
						mode="edit"
					/>
				)}
			</div>
			<ConfirmationModal
				open={!!deleteTaskId}
				onOpenChange={(open) => !open && setDeleteTaskId(null)}
				onConfirm={handleConfirmDelete}
				title="Delete Task"
				description="Are you sure you want to delete this task? This action cannot be undone."
			/>
		</>
	)
}
