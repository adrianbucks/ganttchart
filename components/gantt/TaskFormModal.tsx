'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { TaskForm } from './TaskForm'
import { Task } from '@/types/project'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface TaskFormModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	tasks: Task[]
	task: Task
	onTaskChange: (task: Task) => void
	onTaskSubmit: () => void
	mode: 'add' | 'edit'
	disabled?: boolean
}

export function TaskFormModal({
	open,
	onOpenChange,
	tasks,
	task,
	onTaskChange,
	onTaskSubmit,
	mode,
	disabled,
}: TaskFormModalProps) {
	const handleSubmit = () => {
		onTaskSubmit()
		onOpenChange(false)
	}

	return (
		<>
			{mode === 'add' && (
				<Button onClick={() => onOpenChange(true)}>
					<PlusCircle className="mr-2 h-4 w-4" />
					Add Task
				</Button>
			)}

			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{mode === 'add' ? 'Add New Task' : 'Edit Task'}
						</DialogTitle>
					</DialogHeader>
					<TaskForm
						tasks={tasks.filter((t) => t.id !== task.id)}
						task={task}
						onTaskChange={onTaskChange}
						onTaskSubmit={handleSubmit}
						disabled={disabled}
						mode={mode}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
