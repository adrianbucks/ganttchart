'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { TaskForm } from './TaskForm'
import { Project, Task } from '@/types/project'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface TaskFormModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	project: Project
	task: Task
	onTaskChange: (task: Task) => void
	mode: 'add' | 'edit'
}

export function TaskFormModal({
	open,
	onOpenChange,
	project,
	task,
	onTaskChange,
	mode,
}: TaskFormModalProps) {
	const handleSubmit = () => {
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
						project={project}
						task={task}
						onTaskChange={onTaskChange}
						onTaskSubmit={handleSubmit}
						mode={mode}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
