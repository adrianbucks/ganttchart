'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Task } from '@/types/project'

interface TaskFormProps {
	tasks: Task[]
	newTask: Task
	onTaskChange: (task: Task) => void
	onTaskAdd: () => void
	disabled?: boolean
}

export function TaskForm({
	tasks,
	newTask,
	onTaskChange,
	onTaskAdd,
}: TaskFormProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
			<div>
				<Label>Task Name</Label>
				<Input
					value={newTask.name}
					onChange={(e) =>
						onTaskChange({ ...newTask, name: e.target.value })
					}
					placeholder="Enter task name"
					className="mt-1"
				/>
			</div>
			<div>
				<Label>Duration (days)</Label>
				<Input
					type="number"
					value={newTask.duration}
					onChange={(e) =>
						onTaskChange({
							...newTask,
							duration: Number(e.target.value),
						})
					}
					placeholder="Enter duration"
					className="mt-1"
				/>
			</div>
			<div>
				<Label>Dependencies</Label>
				<select
					multiple
					value={newTask.dependencies}
					onChange={(e) =>
						onTaskChange({
							...newTask,
							dependencies: Array.from(
								e.target.selectedOptions,
								(option) => option.value
							),
						})
					}
					className="w-full mt-1 rounded-md border border-gray-300"
				>
					{tasks.map((task) => (
						<option key={task.id} value={task.id}>
							{task.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex items-end">
				<Button onClick={onTaskAdd} className="w-full">
					<PlusCircle className="mr-2 h-4 w-4" />
					Add Task
				</Button>
			</div>
		</div>
	)
}
